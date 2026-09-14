import { afterAll, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { composePluginFixture, copyHarnessInstall, validatePluginContent } from "../../../tests/harness/plugin-kit.ts";
import { harnessByName } from "../../../tests/harness/harness-matrix.ts";

const root = resolve(import.meta.dir, "..");
const temporary = mkdtempSync(join(tmpdir(), "lb-service-plugin-"));
const harnesses = ["claude", "codex", "copilot", "cursor", "kiro", "kiro-ide", "opencode"] as const;
const implementation = [
  "workspace-scaffold", "workspace-detection", "state-init", "reverse-engineering",
  "practices-discovery", "requirements-analysis", "domain-design", "units-generation",
  "contract-design", "delivery-planning", "code-generation", "build-and-test",
];
const routes: Record<string, string[]> = {
  "lb-service-implementation": implementation,
  "lb-service-design": [...implementation, "functional-design", "nfr-requirements", "nfr-design"],
};
type Grid = Record<string, { stages: Record<string, string> }>;

function snapshot(directory: string): Record<string, string> {
  const files: Record<string, string> = {};
  function walk(current: string): void {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) walk(path);
      else files[relative(directory, path)] = createHash("sha256").update(readFileSync(path)).digest("hex");
    }
  }
  walk(directory);
  return files;
}

function grid(project: string, leaf: string): Grid {
  return JSON.parse(readFileSync(join(project, leaf, "tools/data/scope-grid.json"), "utf8"));
}

function verifyRoutes(value: Grid, stock: Grid): void {
  expect(Object.keys(value).sort()).toEqual([...Object.keys(stock), ...Object.keys(routes)].sort());
  for (const [scope, baseline] of Object.entries(stock)) expect(value[scope]).toEqual(baseline);
  for (const [scope, stages] of Object.entries(routes)) {
    const actual = Object.entries(value[scope].stages)
      .filter(([, action]) => action === "EXECUTE").map(([slug]) => slug).sort();
    expect(actual).toEqual([...stages].sort());
  }
}

afterAll(() => rmSync(temporary, { recursive: true, force: true }));

describe("LB service plugin", () => {
  test("uses supported additive plugin surfaces", () => {
    expect(validatePluginContent(root)).toEqual([]);
  });

  for (const harness of harnesses) {
    test(`${harness}: composes both routes, preserves project policy, and reverses contributions`, () => {
      const project = join(temporary, harness);
      const leaf = harnessByName(harness).manifest.harnessDir;
      copyHarnessInstall(harness, project);
      const memory = join(project, "aidlc/spaces/default/memory");
      writeFileSync(join(memory, "team.md"), "---\ntier_cap: balanced\n---\n\nAffirmed project conventions.\n");
      const knowledge = join(project, "aidlc/spaces/default/knowledge/aidlc-developer-agent");
      mkdirSync(knowledge, { recursive: true });
      writeFileSync(join(knowledge, "project-conventions.md"), "Existing project-owned conventions.\n");
      const memoryBefore = snapshot(memory);
      const knowledgeBefore = snapshot(knowledge);
      const agentsBefore = snapshot(join(project, leaf, "agents"));
      const stages = join(project, leaf, "aidlc-common/stages");
      const stockStages = snapshot(stages);
      const stockGrid = grid(project, leaf);
      const fixture = composePluginFixture({ plugin: "lb-service", harness, projectDir: project, copyInstall: false });
      const checkDrops = (logs: string) => {
        const findings = logs.trim().split("\n").filter(Boolean)
          .map((line) => line.slice(line.indexOf("\t") + 1));
        expect(findings).toEqual(harness === "codex"
          ? ["[advisory] runner regeneration skipped: .codex/skills not present in this install"]
          : []);
      };
      checkDrops(fixture.dropLogs);
      verifyRoutes(grid(project, leaf), stockGrid);
      const runnerArgs = [join(project, leaf, "tools/aidlc-runner-gen.ts"), "scopes"];
      const runnerOptions = {
        cwd: project,
        env: { ...process.env, AIDLC_PROJECT_DIR: project, AIDLC_HARNESS_DIR: leaf, AIDLC_HARNESS_NAME: harness },
        encoding: "utf8" as const, timeout: 30_000,
      };
      // The upstream source composer looks for .codex/skills; the public
      // generator knows Codex's actual .agents/skills location.
      if (harness === "codex") {
        const generated = spawnSync(process.execPath, runnerArgs, runnerOptions);
        expect(generated.status, generated.stdout + generated.stderr).toBe(0);
      }
      const runners = spawnSync(process.execPath, [...runnerArgs, "--check"], runnerOptions);
      expect(runners.status, runners.stdout + runners.stderr).toBe(0);
      for (const scope of Object.keys(routes)) {
        const validation = spawnSync(process.execPath, [join(project, leaf, "tools/aidlc-graph.ts"), "validate-scope", scope], {
          cwd: project,
          env: { ...process.env, AIDLC_PROJECT_DIR: project, AIDLC_HARNESS_DIR: leaf, AIDLC_HARNESS_NAME: harness },
          encoding: "utf8", timeout: 30_000,
        });
        expect(validation.status, validation.stdout + validation.stderr).toBe(0);
      }
      const composedStages = snapshot(stages);
      const repeat = composePluginFixture({
        plugin: "lb-service", harness, projectDir: project,
        pluginBuilt: fixture.pluginBuilt, copyInstall: false,
      });
      // The repeat may be a no-op or record the same Codex advisory.
      if (repeat.dropLogs.trim()) checkDrops(repeat.dropLogs);
      expect(snapshot(stages)).toEqual(composedStages);

      const env = { ...process.env };
      for (const key of Object.keys(env)) {
        if (/^(AIDLC_|AWS_AIDLC_|CLAUDE_|CURSOR_PROJECT_DIR$|PLUGIN_ROOT$)/.test(key)) delete env[key];
      }
      Object.assign(env, { AIDLC_PROJECT_DIR: project, AIDLC_HARNESS_DIR: leaf, AIDLC_HARNESS_NAME: harness });
      const select = (names: string) => {
        const result = spawnSync(process.execPath, [join(project, leaf, "tools/aidlc-utility.ts"), "select-plugins", names], {
          cwd: project, env, encoding: "utf8", timeout: 30_000,
        });
        expect(result.status, result.stdout + result.stderr).toBe(0);
      };
      select("aidlc");
      // AWS retains plugin grid rows as composed-scope metadata after selection.
      // Verify the stock routes and actual stage-source removal independently.
      for (const [scope, baseline] of Object.entries(stockGrid)) expect(grid(project, leaf)[scope]).toEqual(baseline);
      expect(snapshot(stages)).toEqual(stockStages);
      select("aidlc,lb-service");
      composePluginFixture({ plugin: "lb-service", harness, projectDir: project, pluginBuilt: fixture.pluginBuilt, copyInstall: false });
      verifyRoutes(grid(project, leaf), stockGrid);
      expect(snapshot(stages)).toEqual(composedStages);
      expect(snapshot(memory)).toEqual(memoryBefore);
      expect(snapshot(knowledge)).toEqual(knowledgeBefore);
      expect(snapshot(join(project, leaf, "agents"))).toEqual(agentsBefore);
    }, 120_000);
  }
});
