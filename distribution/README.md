# Logicbroker AIDLC release

`release.json` is the fork-owned definition of the tested engine/plugin combination.
Release **2.9.0-lb.1** couples the stock AWS **2.9.0** engine to the published
**lb-service 0.1.0** plugin. This is a compatibility definition, not a new AWS
binary or a republished LB plugin. AWS engine publication and its AWS-authenticated
AI PR review jobs stay restricted to the upstream repository; ordinary fork CI remains enabled.

- `engine` identifies the exact upstream source, native release assets and hashes.
- `plugins` identifies immutable LB packages, original build provenance and tested
  engine compatibility. The plugin's `engine_version: 2.8.1` is its original build
  version; `compatible_engine_versions` records the separately tested runtimes.
- `profiles.stock` installs the stock engine. `profiles.lb-service` adds both LB
  scopes for Claude or Codex. Existing project selections are preserved on update.

The current engine and harness code is unchanged from upstream `v2.9.0`. Native
assets therefore come from the official AWS release, with checksums and provenance
verification. The fork owns the choice of versions, its additive LB plugin source,
and the compatibility evidence. If we change core behavior later, official AWS
binaries would no longer represent it and a separate binary release would be needed.

## Release process

1. Merge an exact upstream release tag into a fork branch, preserving LB additions.
2. Update this manifest and test native installation/refresh, LB composition and
   project-owned context preservation. Preserve the separate CE development branch.
3. Review and merge the fork PR. Pin its immutable commit and this manifest's hash
   in ai-skills; never consume the fork's moving `main` during a user install.
4. In ai-skills, import the manifest with the maintainer command below, run its
   tests and native upgrade checks, and release the companion update.
5. Refresh consuming projects between workflows with ai-skills. The machine
   runtime, project projection and selected plugins are separate lifecycle steps;
   setup/update coordinates them. Project knowledge and provider choices stay owned
   by the project. LB installation and no-Bedrock access remain explicit choices.

From an ai-skills checkout, after checking out the reviewed fork commit:

```sh
python3 plugins/aidlc-workflows/scripts/sync-release.py \
  --from /path/to/aidlc-workflows-lb/distribution/release.json \
  --source-commit FULL_FORK_COMMIT
python3 plugins/aidlc-workflows/scripts/sync-release.py --check
```

These are maintainer commands. Users need no Python for a stock native install;
the existing optional LB/provider helpers require Python 3.11+.

See [2.9.0 validation](validation-2.9.0.md) for tested coverage and limitations.
