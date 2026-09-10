---
target: code-generation
plugin: lb-service
adds:
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
`{{HARNESS_DIR}}/scopes/<active-scope>.md` and apply its contract generation,
ownership, walking skeleton, and verification posture in the code plan and
implementation. Preserve the stage's existing plan-approval gate.
