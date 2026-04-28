# AgentSeatbelt v0.1.0

## Summary

AgentSeatbelt v0.1.0 is a local-first runtime firewall for AI coding agents. It enforces deterministic command risk policy before execution, records action receipts, and supports rollback checkpoints in Git repos.

## Highlights

- Deterministic risk classification with policy actions: allow, block, require approval.
- Secret-read blocking defaults for `.env` and obvious key/token patterns.
- High-risk safety controls with interactive approval and checkpoint capture.
- Action receipts for every decision path.
- Protected session mode: `seatbelt agent dev`.
- Safe demo scripts for public launch walkthroughs.

## Demo commands

```bash
seatbelt init
seatbelt run "echo safe path"
seatbelt run "cat .env"
seatbelt run "rm -rf build" --dry-run
seatbelt run "vercel --prod" --dry-run
seatbelt logs --tail 10
seatbelt doctor
```

## Trust model

- Local-first runtime
- No telemetry
- No cloud upload
- Deterministic policy engine
- Optional baseline seeding is local-only and disabled by default

## Launch upgrade notes

- Session mode hardening with workspace-scoped validation and stable reuse.
- Action receipt hash-chaining for stronger audit continuity.
- CI checks for build, tests, typecheck, lint, and release dry-run.
