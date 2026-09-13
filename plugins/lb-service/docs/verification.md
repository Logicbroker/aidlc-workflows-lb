> Baseline evidence below describes the original 12/15-stage plugin. The
> brainstorming follow-up changes the design route to 16 stages; its separate
> results and limitations are recorded in [brainstorming.md](brainstorming.md).

# Verification — 10 September 2026

The plugin is authored on the organization's main branch at upstream commit
`0865300b9de009aea3605f19af5eb6f48c1d343a`. Native consumer checks use the official
AWS 2.8.1 runtime archive, SHA-256
`a91af010d19196f4110624f429df4172a812863f182b0ae94441cc887b1eff51`, and its verified
Darwin arm64 native binary. This does not replace ai-skills' AWS engine pin.

## Passing checks

- Source packaging and its two-independent-build determinism guard pass for all
  seven harnesses. Core and harness source files are unchanged by this PR.
- Strict TypeScript checks and repository Biome lint pass. Biome reports one
  existing informational diagnostic outside this plugin, with a successful exit.
- Eight plugin tests pass with 359 assertions. They validate the authored plugin,
  expected 12/15-stage routes and dependencies, unchanged stock routes, repeat
  composition, source-contribution removal/re-enablement, and preservation of
  existing memory, project knowledge and agent files across all seven harnesses.
- Separate native consumer checks pass for all seven harnesses: fresh config,
  plugin sync, graph checks, scope dependencies, scope-runner generation/check,
  model-policy check, repeat sync and contribution removal/re-enablement. Child
  PATH contains only OS tools; the verified native binary is invoked by absolute
  path. Bun and Node are maintainer build tools, not consumer requirements.
- A same-version native 2.8.1 refresh followed by plugin sync passes on the Claude
  fixture. Preview: zero creates, one update, 307 preserves, zero removals and zero
  conflicts. Apply uses the exact preview token. Project memory and the existing
  project-conventions file remain byte-identical afterward.
- Native doctor on the composed Claude fixture reports **64 passes, four warnings,
  zero failures**, including passing composed-plugin surface and selection checks.
  Warnings concern the deliberately restricted PATH, absent host CLI on that PATH,
  stale update cache and lack of permanent host plugin registration for the test
  fixture. Offline tests do not prove provider authentication or service delivery.

## Convention integration follow-up — 11 September 2026

The 2026-09-11 follow-up removes the historical-folder lookup from practices
discovery. The eight plugin tests / 359 assertions and deterministic packaging
pass again. The companion shared-services convention port separately verifies
the actual seven knowledge files and project rules through native 2.8.1 context
delivery and refresh/plugin-sync preservation across all seven harnesses. Runtime
discovery now uses project-owned knowledge and current component sources only.

## AWS 2.8.1 limitations observed

1. Selecting only `aidlc` removes LB fragments and membership additions; the stage
   source files return byte-for-byte to stock. However, the runtime retains LB
   scope-grid rows and generated runners. Re-enabling and syncing restores the
   plugin correctly. Selection alone is not verified as complete removal of LB
   workflow entry points and must not be offered as a complete installer rollback.
2. The source composer looks for `.codex/skills`, while Codex uses `.agents/skills`.
   It records an advisory and skips automatic runner generation. The public native
   `engine gen runner-scopes` command handles the correct path. The first Codex
   runner check failed before explicit generation and passed afterward; the other
   six initial checks passed. The documented install sequence includes generation.
3. Native `aidlc plugin build ... --plugin-root ...` cannot resolve its bundled
   authoring context and hook template (it reports a `/$bunfs/root/data/...` path).
   Build with the repository's source packager. Native consumption of those built
   projections works; no custom compiled engine is introduced here.
4. Plugin memory projection is documented as future work with no promised release
   or date in 2.8.1. This plugin uses no deferred memory or dependency-edge
   contribution and does not ship domain/team knowledge as framework knowledge.

These findings are retained rather than repaired by generated-file edits or an
engine fork. Before rollout through ai-skills, publish a reviewed host package and
establish a verified uninstall/rollback path. Live host startup and a small service
pilot remain adoption checks; Windows host execution was not tested on macOS.
