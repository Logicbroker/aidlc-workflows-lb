---
target: requirements-analysis
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
`{{HARNESS_DIR}}/scopes/<active-scope>.md` and apply its outcome, selection limits,
and verification posture during this stage. Include these decisions in the
requirements; reuse affirmed practices and ask about unresolved choices.
