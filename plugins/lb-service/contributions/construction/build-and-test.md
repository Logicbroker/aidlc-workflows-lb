---
target: build-and-test
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
`{{HARNESS_DIR}}/scopes/<active-scope>.md` and apply its coverage and CI floor,
including any affirmed applicable team posture and existing stronger thresholds.
Record behavioral, contract, authorization/tenancy, boundary, and relevant
integration evidence. A skipped CI Pipeline creation stage does not waive CI.
