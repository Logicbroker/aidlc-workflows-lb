# Logicbroker service plugin

An optional service workflow for AWS AI-DLC 2.8.1. It adds two scopes using
existing AWS stages and agents. It does not change the engine, stock scopes,
provider settings, model policy or project memory.

| Scope | Stages | Use when |
| --- | --- | --- |
| `lb-service-implementation` | 12 | One independently delivered service uses established business and platform patterns. |
| `lb-service-design` | 15 | The service needs dedicated functional, data-model or nonfunctional design. |

The implementation route includes initialization, reverse engineering, practices
discovery, requirements, domain design, units, contract design, delivery planning,
code generation, and build/test. The design route also includes functional design,
NFR requirements and NFR design. Initialization accounts for three stages.

Both finish at verified implementation ready for review. A request to deploy also
needs the relevant Operation stages and their prerequisites in its composed plan.
An omitted CI Pipeline creation stage does not waive the repository's existing CI.
Standard depth/test strategy and the walking skeleton are enabled. Stage review
classes, human gates, plan approval and agent model/effort defaults remain AWS's;
the plugin sets no review cap or memory tier cap. The stock default scope remains
unchanged; select an LB scope explicitly.

## Conventions

The practices-discovery contribution asks agents to verify conventions against the
current component, its project knowledge, and its declared generation/verification
commands. It distinguishes affirmed standards from proposed/prototype guidance.
Requirements, code generation and build/test also receive the active scope's
contract, implementation and verification guidance through supported fragments.
Scope-file prose alone is not delivered automatically by the engine.

The retained shared-services `aidlc-lb/` directory contains useful source material.
See the [convention inventory](docs/conventions.md) for exact sources, status and
intended destinations. Project-specific SDK, identity, tenancy and stack decisions
belong to the consuming repository's active-space knowledge and affirmed memory.
This plugin does not import the old agent roster, skills, adapters or intent records.

AWS documents plugin memory projection as a future feature. In 2.8.1,
`contributes.memory` is rejected and plugin packaging does not populate project
knowledge. There is no release date in the versioned documentation. Use the
[supported project knowledge paths](../../docs/harness-engineering/07-team-knowledge.md)
for repository conventions; do not claim that a plugin install has installed them.

## Build and verify

For framework contributors, the normal repository build emits all seven harness
projections under ignored `dist/plugins/lb-service/<harness>/`:

```sh
bun install --frozen-lockfile
bun scripts/package.ts
bun scripts/package.ts --check
bun test plugins/lb-service/tests/plugin.test.ts
```

Building this source uses Bun as a maintainer tool. Consumers compose the built
projection with the native AWS 2.8.1 binary, without Bun/Node/Python on their PATH.
The native `plugin build` path was also tested but fails to resolve its bundled
authoring context/hook template in the published 2.8.1 binary; use the source
packager above for this release.

The authored source directory is not an
installable host plugin. Generated outputs stay out of Git; publishing a versioned
host package and adding explicit optional installation to ai-skills are separate
delivery steps. Adding this source to the fork does not repin the AWS engine or
silently install the plugin in existing projects.

After an approved host installation, run these commands from the target project:

```sh
aidlc engine plugin sync
aidlc engine plugin select aidlc,lb-service
aidlc engine graph compile --check
aidlc engine gen runner-scopes
aidlc engine gen runner-scopes --check
aidlc doctor --json
```

The selection example assumes no other intentional plugins; retain their names
when they exist. Then use `/aidlc --scope lb-service-implementation` or
`/aidlc --scope lb-service-design` (`$aidlc` in Codex).

Keep the explicit scope-runner generation step: the upstream source compose hook
checks `.codex/skills`, but Codex uses `.agents/skills`, so it reports an advisory
and skips that automatic generation. The public generator handles the actual path.

Refresh the engine between workflows, then run `/aidlc plugin sync` to restore the
plugin's composition. Verify the selected stages, project knowledge and model
policy after refresh and after a real host startup. Doctor's offline file checks
do not prove provider authentication or successful service delivery.

To disable LB behavior, use `aidlc engine plugin select aidlc`, again retaining
other intentional plugins. AWS keeps installed plugin files for re-enabling;
selection removes their stage contributions. **AWS 2.8.1 retains the LB scope-grid
entries and generated scope runners after selection disables the plugin.** This
is not a complete removal of the LB workflow entry points. The tests prove source
contribution removal and restoration; they do not claim selection restores an
entirely stock runtime. Resolve that upstream behavior or verify a full uninstall
before offering disable as a complete rollback in ai-skills. A full uninstall needs the
matching host registration removed, otherwise its startup hook can compose it
again. Do not delete ownership records or project knowledge to force an uninstall.

## Source boundary

Scope selection is adapted from the former personal fork's service plugin, with
new `lb-service-*` identities and upstream review defaults. Authored files live
only under this plugin. No `core/` or `harness/` edits, custom agents, runtime
scripts, new dependency edges or generated-file patches are needed.

See [verification results and runtime limitations](docs/verification.md).

The fork's main branch contains upstream fixes after tag `v2.8.1`; this plugin's
release compatibility is checked separately against the published 2.8.1 native
runtime. Do not substitute the fork's moving main branch for ai-skills' engine pin.
