---
target: requirements-analysis
plugin: lb-service
adds:
  consumes:
    - artifact: lb-service-brainstorm
      required: false
  scopes:
    - lb-service-implementation
    - lb-service-design
fragments:
  - anchor: before-step:1
    order: 100
---

## fragment: before-step:1

### LB service guidance

For `lb-service-implementation` or `lb-service-design` only, read
`{{HARNESS_DIR}}/scopes/<active-scope>.md` and apply its outcome, selection limits,
and verification posture during this stage. Include these decisions in the
requirements; reuse affirmed practices and ask about unresolved choices.

For `lb-service-design`, resolve the approved `lb-service-brainstorm` artifact
from this intent's Service Brainstorm record. Read its Requirements handoff,
carry stable decision/requirement IDs into the requirements traceability, and
reuse settled answers. If the record is absent, unapproved, or still contains
blocking product questions, stop and return to the brainstorming stage through
the engine's normal revision/routing flow; do not fabricate a handoff or silently
fall back to a different scope. A human-approved custom plan that intentionally
removes brainstorming must explicitly resolve the replacement input at its plan
gate. The implementation route and stock scopes do not require this artifact.

The consume is optional in the shared core stage because other scopes do not
run brainstorming. The scoped handoff check above is an agent instruction, not
a new engine-enforced artifact or approval gate. Ordinary stage sequencing and
approval use the existing AIDLC engine; this contribution does not use deferred
`adds.requires_stage` support.
