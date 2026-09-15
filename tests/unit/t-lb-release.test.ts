import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { AIDLC_VERSION } from "../../core/tools/aidlc-version";
import release from "../../distribution/release.json";
import plugin from "../../plugins/lb-service/.aidlc-plugin/plugin.json";

test("LB release couples the stock engine to a compatible plugin and explicit profiles", () => {
  expect(release.schema_version).toBe(1);
  expect(release.engine.version).toBe(AIDLC_VERSION);
  expect(release.engine.release).toBe(`v${AIDLC_VERSION}`);
  expect(release.engine.repository).toBe("awslabs/aidlc-workflows");
  expect(release.engine.source_commit).toMatch(/^[a-f0-9]{40}$/);
  expect(release.plugins["lb-service"].version).toBe(plugin.version);
  expect(release.plugins["lb-service"].compatible_engine_versions).toContain(AIDLC_VERSION);
  expect(release.profiles.stock.plugins).toEqual([]);
  expect(release.profiles["lb-service"].plugins).toEqual(["lb-service"]);
  expect(Object.keys(release.plugins)).toEqual(["lb-service"]);
  for (const scope of release.profiles["lb-service"].scopes) {
    expect(readFileSync(new URL(`../../plugins/lb-service/scopes/${scope}.md`, import.meta.url), "utf8")).toContain(scope);
  }
  for (const digest of Object.values(release.engine.checksums)) expect(digest).toMatch(/^[a-f0-9]{64}$/);
});
