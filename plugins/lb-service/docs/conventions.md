# Convention sources and adoption boundary

Reviewed 2026-09-10. The source is the retained
[`aidlc-lb/` tree in shared-services](https://github.com/Logicbroker/shared-services-aidlc/tree/2e79179680e8b4501909f638e5b1ca9a85ec6a95/aidlc-lb).
It is migration evidence, not a runtime dependency. The source revision's README
describes ports from before the deliberate stock reset. The current convention
port belongs in the consuming project's active-space knowledge and memory, with
current code evidence and prototype distinctions. The plugin's discovery step
reads those active files; it does not consult the historical tree.

## What is present

Paths below are relative to the source tree above.

| Source | Useful guidance | Status and destination |
| --- | --- | --- |
| `policies/coding-standards.md`, `policies/contract-first.md` | Typed boundaries, contract-owned generation, handwritten business behavior and declared responses. | The plugin's scope carries the generic delivery method. Exact OpenAPI paths and `x-lb` requirements belong in project knowledge. |
| `standards/testing-conventions.md`, `policies/testing-and-quality.md` | Smallest credible behavioral proof; contract, denial, boundary and integration tests; controlled I/O and test data. | Scope guidance retains behavioral/contract/security proof and existing CI. Project gates and commands remain repository-owned. |
| `overlays/python-fastapi.md`, `skills/apply-python-conventions/SKILL.md` | Typed HTTP boundaries, async I/O, lifespan-managed resources, configuration and safe error mapping. | Explicitly prototype/experimental. Candidate for `knowledge/aidlc-developer-agent/python-conventions.md` in the active project space, after checking current code. |
| `overlays/csharp-conventions.md`, `skills/apply-csharp-conventions/SKILL.md` | Nullability, ownership/disposal, cancellation, value semantics, controllable time and local analyzers. | Prototype; candidate project developer knowledge. Do not refactor legacy code solely to match it. |
| `overlays/dotnet-aspnet-conventions.md`, `skills/apply-dotnet-service-conventions/SKILL.md` | Composition, typed options, DI lifetimes, HTTP clients and verification. | Prototype; proposed framework/tooling choices require confirmation against the affected component. |
| `policies/internal-service-calls.md` | SDK-owned transport, declared consumed operations and separate SDK changes for missing capability. | LB platform-specific. Verify actual SDK support before adopting into project architecture/developer knowledge. |
| `policies/tenancy-and-data.md` | Authenticated tenant identity, allowed/denied evidence and platform-scoped exceptions. | LB policy-specific. Reconcile with current contracts, SDK and approved ADRs; never infer an access grant from this document. |
| `standards/convention-evidence-matrix.md`, `overlays/prototype-lifecycle.md` | Evidence weight, adopted/prototype/deferred distinctions and promotion criteria. | Retain as provenance for every selected convention. The matrix is dated 2026-07-30 and needs current confirmation. |

## Checks against the current repository

- The [.NET starter](https://github.com/Logicbroker/shared-services-aidlc/blob/2e79179680e8b4501909f638e5b1ca9a85ec6a95/templates/dotnet-shared-service/service-root/Directory.Build.props)
  does contain `net10.0`, nullable references and implicit usings, but labels the
  framework choice proposed and warnings-as-errors a pilot candidate. Presence
  in a template does not turn either into an approved organization-wide mandate.
- The [order-lifecycle application](https://github.com/Logicbroker/shared-services-aidlc/blob/2e79179680e8b4501909f638e5b1ca9a85ec6a95/services/svc-order-lifecycle/src/main.py)
  uses an async lifespan and boundary error handlers. That supports those specific
  Python patterns; it is not proof of every claim in the prototype overlay.
- The matrix explicitly defers an organization-wide coverage number, analyzer
  severity and central package management. The scope's AWS production verification
  floor is distinct from an asserted LB organization policy; existing stronger
  project gates remain authoritative.

## How to adopt a convention

1. Select a small source section needed for the service and identify the current
   component, contract, code/configuration and test evidence supporting it.
2. Preserve its status: affirmed, prototype, proposed or deferred. Do not treat a
   template, historical reference or unimplemented SDK capability as an approval.
3. Put reference guidance in the consuming repository's
   `aidlc/spaces/<active-space>/knowledge/<AWS-agent-slug>/` directory. Use
   `aidlc-shared/` only for conventions that apply to every agent. Put affirmed
   standing practices in that space's `memory/team.md` or `memory/project.md`.
4. Use the AWS knowledge preflight and a small service task to prove the relevant
   agent loads and applies the convention. Enforce mechanical rules through the
   existing formatter, generator, tests or CI where appropriate.
5. Record the adoption and verify an engine refresh plus plugin sync preserves it.

These are instructions for a reviewed project change, not an installer that
copies files into every consumer. The LB plugin uses supported scope membership
and stage fragments. It does not declare the deferred `contributes.memory`
surface or put LB domain/team knowledge into AWS's framework-knowledge directory.

AWS explicitly describes a future merge into the default-space memory seed in
[Plugin Authoring](../../../docs/harness-engineering/10-authoring-a-plugin.md#4-packaging-the-other-primitives)
and [Plugin Mechanism §7](../../../docs/reference/18-plugin-mechanism.md#7-methodrules-agents-knowledge-scopes-and-activation).
The 2.8.1 documentation gives no delivery version or date. This plugin does not
depend on that future feature.
