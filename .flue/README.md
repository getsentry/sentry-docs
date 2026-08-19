# Issue Triage Shadow Mode

This directory contains the read-only Flue v2 issue-triage experiment. Shadow mode fetches public GitHub context, lets the model use two narrow read tools, and emits a versioned JSON decision plus a deterministic policy projection. It has no GitHub or Linear write capability.

## Review a Single Issue

```bash
ANTHROPIC_API_KEY=... GH_TOKEN=... pnpm triage:shadow --issue 17799
```

Set `TRIAGE_OUTPUT=.flue/output/triage-17799.json` to retain the complete result. In GitHub Actions, each run writes a job summary and uploads this JSON as an artifact.

The workflow always supports manual dispatch. Automatic shadow runs remain disabled until the repository variable `FLUE_TRIAGE_SHADOW_ENABLED` is set to `true`; when enabled, the exact `linear-code` linkback comment triggers triage.

## Validate

```bash
pnpm triage:test
ANTHROPIC_API_KEY=... GH_TOKEN=... pnpm triage:eval
```

`triage:test` covers deterministic normalization and policy. `triage:eval` runs the live model over the eight historical issues cited by PR #17811 and asserts their stable classifications and selected flow outcomes.

Employee detection initially treats GitHub `OWNER` and `MEMBER` associations as employees. Edit `employee-overrides.json` to handle exceptions in either direction.

## Future Write Mode

Write mode is intentionally out of scope. Before it is enabled:

- Review shadow artifacts for routing, priority, evidence, and policy accuracy.
- Persist first-triage and needs-information timestamps so lifecycle deadlines do not reset.
- Reconcile qualifying Linear activity before evaluating six-month inactivity.
- Create a `Parking Lot` canceled-type status in the Linear DOCS workflow.
- Validate a recommended resolution flow before applying its employee-policy exemption.
- Put GitHub, Linear, and pull-request mutations in separately permissioned jobs.
