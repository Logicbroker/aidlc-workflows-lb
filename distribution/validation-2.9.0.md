# AWS 2.9.0 / LB 0.1.0 compatibility — 2026-09-15

The release definition pairs upstream tag `v2.9.0`
(`22f5d1b15a064c9ae80046e5b1761d5877e2f69f`) with the unchanged published
`lb-service-v0.1.0` Claude/Codex packages. Verification used macOS arm64,
Bun 1.4.0 for source tests and Python 3.12 for the ai-skills lifecycle fixture.
Consumer projects use the official native binary, without Bun or Node.

## Source and packaging

- `git diff v2.9.0 -- core harness scripts` is empty: engine, harnesses and
  packager match upstream. LB content stays under `plugins/lb-service`.
- Source package generation is deterministic across seven harnesses.
- `bun test plugins/lb-service/tests/plugin.test.ts`: 8 tests, 359 assertions pass,
  covering both scopes across all seven source projections, stock route preservation,
  idempotent composition, project policy preservation and contribution removal.
- Release-definition validation, TypeScript checks and repository lint pass.
- Downloaded native assets match the manifest checksums. The official checksum
  file verifies against AWS's release attestation using `gh attestation verify`.

## Native consumer tests

ai-skills' `lb_service_native_smoke.py` runs against the published native executable
and actual LB release archives in disposable Claude/Codex projects with isolated
host inventories. It covers composition, explicit selection, runner/graph checks,
no-Bedrock provider mappings, repeated refresh, preserved knowledge/memory and
selection, refusal to prune locally modified plugin files, then guarded removal.
Both fresh 2.9.0 lifecycle tests and 2.8.2 → 2.9.0 upgrades pass.

The upgrade fixture compares stock routes to the **destination** AWS runtime:
2.9.0 changes `classic` to skip Operation stages. LB composition must not undo
that upstream change. LB implementation/design retain their 12/15-stage routes.

The separate seven-harness 2.8.2 → 2.9.0 upgrade fixture preserves all 10 seeded
project-state files per harness, with zero removals/conflicts and no new doctor
failures. Claude, Codex, Cursor, Kiro CLI, Kiro IDE and OpenCode have zero doctor
failures. Copilot retains one pre-existing failure because the disposable folder
has not been trusted in the user's Copilot configuration. Host warnings are retained.

## Limits

These are mechanical native lifecycle and source composition checks, not a live
model-driven service delivery. They do not prove login, model availability, host
trust or a complete implementation workflow. Real host registries and the machine
runtime were not modified. The monorepo rollout and its existing PR remain separate.
Windows/Linux native binaries are hash-pinned but were not executed here. The
existing CE draft is not part of this release.
