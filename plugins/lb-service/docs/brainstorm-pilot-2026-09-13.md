# Brainstorm acceptance pilot — AWS 2.8.1

**Result: the handoff acceptance test failed. Keep PR #3 in draft.**
The live run generated a CE-format requirements document and an AIDLC snapshot
after a separately recorded summary confirmation, but the documents did not
consistently preserve the confirmed decisions. No final stage approval was
given, and Requirements Analysis was not executed with this invalid handoff.

## Setup and scope

- Plugin head: `0b4bd12a6e14d573b5d80236fd8f1b148a71f52a`.
- Installed native AWS binary and fresh stock project projection: **2.8.1**.
- Claude Code **2.1.270**, direct `claude-sonnet-4-6[1m]`.
- CE **3.25.0**, source `44d65ad64a0ac8e542eabee31ce031a7aeb41b28`.
- Fresh temporary Git project, `lb-service-design` intent, plugin composed from
  the PR's generated Claude projection. No existing project was refreshed.
- CE was available through a session-only `--plugin-dir`; only project/local
  Claude settings were loaded. The fixture alone was temporarily trusted to run
  its normal hooks. The previous trust flag was restored afterward.
- Claude ran through `--print --output-format stream-json` and separate resumed
  user turns. The test driver supplied labelled product answers, then a separate
  `Looks correct` response. These are **automated test inputs**, not a human's
  approval of a real service or this PR. No audit receipts were hand-written.

The scenario was a small read-only job-status service for authenticated internal
operators. Its four statuses were `never_run`, `running`, `succeeded`, and
`failed`; unknown jobs returned not found. Failure details were restricted to
an approved category/message allowlist. Storage, authentication mechanism,
freshness SLA and allowlist content were expressly deferred to AIDLC design.
There was no service implementation, external service call or deployment.

## Observed checks

Artifact format/provenance was checked against the files; decision consistency
was assessed by comparing their text with the supplied and confirmed answers.

| Check | Result |
| --- | --- |
| Plugin source tests, all seven projections | 8 passed, 863 assertions |
| Fresh native doctor | 64 passed, 3 warnings, 0 failed |
| Load AIDLC and pinned CE source | Passed; revision verified by Git |
| Wait before generating artifacts | Passed; neither output existed at the summary question |
| Separate summary response through normal hooks | Passed; `SUMMARY_CONFIRMATION_RECORDED` includes the confirmed-content hash |
| CE document contract | Contains `ce-unified-plan/v1`, `requirements-only`, and `ce-brainstorm` |
| Snapshot provenance | Correct CE revision and exact source path, with a Requirements handoff section |
| Preserve deferred decisions and source/snapshot agreement | **Failed**, as described below |
| No CE planner/work/review/learning/shipping skill dispatch | None observed |
| Final approval and requirements consuming the handoff | **Not performed** after the failed content check |

This run read and followed the actual CE entry point and references, but did
**not** call `Skill(compound-engineering:ce-brainstorm)`: its only Skill call was
`aidlc`. It therefore does not independently prove Claude's CE Skill-dispatch
path. The earlier pilot did invoke that skill but stopped before artifact
generation. Neither trace alone proves the complete intended integration.

The retained doctor warnings concerned login-independent PATH, stale update
cache, and host plugin inventory. The test process supplied the native command
on PATH. These warnings were not suppressed or counted as passes.

## Findings to resolve before repeating the pilot

1. **Deferred design choices became blockers in the CE source.** The supplied
   answers and confirmed summary deferred the safe-message allowlist and
   known-job lookup mechanism to AIDLC design. The CE document instead placed
   these under `Resolve Before Planning`. The AIDLC snapshot called them
   deferred design questions and moved the allowlist deadline to implementation.
   The two artifacts therefore disagreed about readiness. Correct the source
   and revalidate it before copying a snapshot; do not silently reinterpret it
   in the snapshot or approve the mismatch.
2. **Generation introduced an unconfirmed semantic choice.** Both artifacts
   defined the freshness timestamp as the time the status record was written to
   the data store. The confirmed answers required a timestamp in the response
   body but did not settle that meaning. This also leaves the known-but-never-run
   case unclear when no status record exists. Such a choice needs an explicit
   assumption and confirmation, rather than being presented as agreed content.
3. **The source was not read back before the snapshot was written.** The trace
   wrote the CE document and then the handoff without an intervening Read of the
   returned source path. The adapter's existing validation instructions were
   insufficient to make this host perform that step reliably.
4. **Native review-brief failed.** `aidlc engine review-brief summary` returned
   `aidlc-review-brief.ts does not export main(argv)` on the installed 2.8.1
   binary. The host incorrectly described this as an unimplemented subcommand
   and continued with its own summary. The checkpoint receipt itself succeeded,
   but the full prescribed summary protocol did not pass.
5. **A failed learning check was treated as zero candidates.** The first
   `aidlc engine learnings surface --slug lb-service-brainstorm` failed because
   the fixture had no `runtime-graph.json`. The host continued as though the
   result were empty. A subsequent diagnostic `aidlc engine runtime compile`
   succeeded; rerunning `learnings surface` then returned actual candidates.
   Establish the normal compile point in the pilot and stop on an unavailable
   result rather than interpreting failure as an empty successful result.

Some shell diary-write attempts also met the test session's tool restrictions.
That is a test-runner limitation, not evidence that native diary writes fail in
an ordinary interactive installation.

## Repeat criteria

Use a fresh disposable 2.8.1 project and the pinned CE source. Require the actual
Claude skill invocation, normal summary receipt, source read-back and semantic
comparison before snapshot generation. Include a decision explicitly deferred
to design, and check that no new field meaning is introduced without confirmation.
Runtime helper failures must stop the relevant check or be resolved through a
documented normal command before proceeding. Only a consistent, reviewed handoff
should receive the test driver's separate final approval and be consumed by
AIDLC Requirements Analysis. Repeat on Codex before general rollout.

The developer's runtime remains **2.8.1**. Updating to **2.8.2 is deferred**;
this test did not move fork refs, change ai-skills pins, or refresh shared-services.

## Local evidence identities

The temporary fixture retains the JSONL traces, user-turn inputs, audit and
result manifest. Generated artifacts were not committed as project knowledge.

- CE artifact: `docs/plans/2026-09-13-2341-feat-job-status-service-plan.md`
  — SHA-256 `d789fea0ef25a0330c3a23eb7ed2dca6e7d0d40b52fb84881f82eb52f297a98e`.
- AIDLC snapshot: intent `260913-brainstorm-acceptance-te`,
  `ideation/lb-service-brainstorm/lb-service-brainstorm.md`
  — SHA-256 `967ead116765b0f9832c454cf678f28462fda7d3836938111e7e6f5b3ec83398`.
