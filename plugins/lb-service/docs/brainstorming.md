# Compound Engineering brainstorming in the LB service route

The optional `lb-service-design` route runs `lb-service-brainstorm` after
initialization, in Ideation, before Inception. It then continues through the
existing service requirements, design, implementation and verification stages.
The route has 16 stages. `lb-service-implementation` keeps its 12-stage route;
stock scopes skip the new stage.

This is an adapter to the separately installed Compound Engineering skill. It
does not vendor an imitation of that skill or install the rest of CE's workflow.
The existing LB plugin owns the added stage, so a second AIDLC plugin and the
currently deferred inter-plugin dependency resolver are unnecessary. This
follow-up is separate from the initial LB plugin PR.

## Responsibility and artifacts

| Owner | Responsibility |
| --- | --- |
| Compound Engineering `ce-brainstorm` | Interactive exploration, alternatives, scope, success/failure behavior and a requirements-only Markdown artifact. |
| LB Service Brainstorm stage | Check host availability/source identity, constrain the CE handoff, capture the result in this intent and obtain AIDLC confirmation/approval. |
| AIDLC | Workflow state, requirements and design artifacts, delivery planning, implementation, existing stage reviews, learning and human gates. |
| ai-skills, in a later rollout | Optional installation, verified version selection, update/re-sync and diagnostics. |

CE writes its artifact under its configured documentation root. After AIDLC Assumption Confirmation, the stage reads
that exact returned path and writes `lb-service-brainstorm.md` under its own
engine-resolved intent record. The snapshot preserves settled IDs and decisions,
records its source, and lists questions deferred to design. Requirements analysis
uses that snapshot; there is no parallel CE implementation plan or learning store.

## Inspected upstream contract

- Repository: [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin).
- Plugin version: **3.25.0**.
- Source revision: **44d65ad64a0ac8e542eabee31ce031a7aeb41b28**.
- Entry point: [ce-brainstorm/SKILL.md](https://github.com/EveryInc/compound-engineering-plugin/blob/44d65ad64a0ac8e542eabee31ce031a7aeb41b28/skills/ce-brainstorm/SKILL.md).
- Handoff: [references/handoff.md](https://github.com/EveryInc/compound-engineering-plugin/blob/44d65ad64a0ac8e542eabee31ce031a7aeb41b28/skills/ce-brainstorm/references/handoff.md).

The artifact uses `ce-unified-plan/v1`, `artifact_readiness: requirements-only`,
and `product_contract_source: ce-brainstorm`. We explicitly request Markdown and
a persisted artifact even for a small brainstorm. CE's default can finish a
lightweight brainstorm in chat; that does not satisfy this adapter's handoff.

Upstream has **no documented brainstorm pipeline/return-to-caller flag** at the
inspected revision. Its default handoff offers CE planning, document review,
prototyping or autonomous shipping. The adapter passes an explicit constrained
task that pauses for AIDLC Assumption Confirmation before CE artifact generation
and returns to AIDLC afterward, and requires stopping if that constraint cannot be
honored. Do not invent a supported upstream API or describe this as a completed
live integration based solely on composition tests.

Only Claude and Codex are targeted for live use. A skill with the right name is
not sufficient: its installed provenance and required references must match the
inspected source, and its host must support the required interaction. Missing
skills/references, unknown revisions, paused dialogue, unresolved product
questions or invalid artifacts leave the stage incomplete. Installation or
upgrading CE requires a separate reviewed host setup; this PR changes no user's
plugin installation, credentials, model settings or ai-skills engine pin.

## What is enforced, and what is not

The AIDLC graph places the new stage in Ideation and requires `state-init`.
The existing serial engine visits it before the Inception service stages. It
uses the existing summary-confirmation and approval protocol; CE reporting
readiness does not approve the AIDLC stage.

The contribution to requirements declares an **optional** consume so other
scopes remain valid. For the design route, its delivered instructions require
the approved brainstorming handoff. Artifact/provenance checks and the CE
return boundary are instructions executed by the host agent, not a new native
validator or a tamper-proof gate. This PR adds no core approval/fingerprint
logic, `adds.requires_stage`, `when` predicate or dependency-resolution claim.
A human-approved custom plan can deliberately change the route; it must resolve
replacement inputs explicitly rather than pretend brainstorming happened.

## Verification and rollout

The plugin test exercises all seven authored harness projections for graph
composition: correct 12/16-stage membership, no new executions in stock routes,
ordering before requirements, idempotent composition, disabled-stage selection,
restored stock contributions, and preserved project knowledge/memory/agents.
Composition on seven harnesses does not establish CE invocation support on seven
hosts; the stage explicitly limits live integration to Claude/Codex.

Verified on 13 September 2026:

- Eight plugin tests pass (863 assertions), including fresh-intent routing to
  Service Brainstorm with `gate: true` in every projection.
- Source packaging is deterministic across two independent builds for all
  seven harnesses. All three TypeScript configurations and plugin Biome checks
  pass.
- The official AWS 2.8.1 native binary installs the stock runtime, composes the
  plugin, generates runners and validates the design scope for Claude and Codex.
  Doctor reports Claude **64 passed / 3 warnings / 0 failed**, Codex
  **57 passed / 3 warnings / 0 failed** in disposable fixtures.
- Native fresh-intent creation followed by `engine orchestrate next` and its
  steering continuation reaches `lb-service-brainstorm`, with `gate: true` and
  Practices Discovery next in the greenfield fixture. The test does not approve
  or execute the stage. The initial single-stage read probe has `gate: false`,
  so it was not used as evidence of workflow approval behavior.

The native checks use the verified stock 2.8.1 runtime, the source-built plugin
projection and `AIDLC_PLUGIN_ROOT` in disposable projects. They do not install CE
or register a host plugin globally. Retained doctor warnings concern host/plugin
inventory and local cache/environment; no warning was suppressed. Normal native
refresh/uninstall limitations remain those of the base plugin PR.

Before enabling this route for other developers, run an interactive pilot on
both Claude and Codex with the inspected CE source. Verify a real brainstorm,
its Markdown artifact, return without CE planner/work/review/learning dispatch,
AIDLC approval and requirements consuming the agreed decisions. Repeat with CE
missing, an unsupported revision, a paused brainstorm, an unresolved product
question and a revised artifact. Record actual results, not simulated user
approval. This PR remains a draft pending the completed pilot.

Refresh and selection have the existing AWS 2.8.1 limitations documented in
[verification.md](verification.md): sync after engine refresh; selection retains
some plugin files/scope metadata, so it is not a full uninstall. Publish and
verify the host package, CE installation/provenance and full rollback before
adding this option to ai-skills. Existing workflows must finish before changing
scope membership; this PR does not migrate or resume an active intent.


## Follow-up testing: native 2.8.2 and live host

The official AWS 2.8.2 macOS ARM64 binary and runtime archive were downloaded
from the release and verified against the published SHA-256 digests. Both
Claude and Codex disposable installations compose this plugin and route a fresh
intent to Service Brainstorm with `gate: true`. Doctor reports Claude 64 passed,
3 warnings, 0 failed; Codex 57 passed, 3 warnings, 0 failed.

A separate 2.8.1 -> 2.8.2 refresh using the proposed ai-skills provider helper
preserves project-memory and knowledge hashes for both harnesses. Saved direct
provider settings reapply without drift; model-policy checks pass. Doctor after
refresh: Claude 64 passed / 3 warnings / 0 failed; Codex 59 passed / 2 warnings /
0 failed. This tests the helper against 2.8.2 assets, not a changed ai-skills
release pin or an upgrade of a developer's actual installation.

The live Claude test invoked the actual pinned `compound-engineering:ce-brainstorm`
skill in a session-only plugin installation. The Codex test read the actual
linked CE skill and AIDLC protocol. They used a disposable job-status service
scenario, with no real service calls or deployment. The initial Claude run was
restarted without user-level settings after an unrelated personal startup hook
interfered. The bounded live runs did not complete a full brainstorm-to-requirements
workflow.

The test exposed a stage-instruction conflict: the original adapter wrote its
handoff before AIDLC Assumption Confirmation, while the stage protocol requires
confirmation before artifact generation. The corrected stage pauses before CE
Phase 3, obtains real AIDLC summary confirmation, then permits the CE artifact
and AIDLC handoff snapshot. A final AIDLC approval remains separate. Scripted
fixture inputs do not count as either approval. The normal CE handoff and these
checkpoints still require host-agent compliance; no unsupported native enforcement
or CE pipeline API has been introduced.

The corrected Claude resume exited successfully after three turns, re-read the
updated installed stage and explicitly paused at Assumption Confirmation before the requirements artifact. It used the
existing CE brainstorm session and labelled fixture inputs. No CE planner/work/
review/learning/shipping skill was invoked in the observed trace, and no CE plan
or AIDLC handoff artifact had been written at that checkpoint. This is a verified
pause/ordering check, not a completed post-confirmation handoff or approved stage.
The Codex run was bounded and stopped after reading the contracts/starting the
pack-resolution step; its full live handoff remains unverified.
