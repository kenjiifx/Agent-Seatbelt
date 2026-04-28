# Contributing to AgentSeatbelt

Thanks for helping improve AgentSeatbelt.

## Development workflow

```bash
npm install
npm run build
npm test
npm run typecheck
npm run lint
```

## Pull request expectations

- Keep changes scoped and deterministic.
- Include tests for behavior changes.
- Preserve local-first guarantees (no telemetry, no cloud upload).
- Update docs when user-facing behavior changes.

## Commit style

Use concise conventional commit prefixes:
- `feat:`
- `fix:`
- `docs:`
- `test:`
- `chore:`

## Security-sensitive changes

If you touch risk classification, policy decisions, or receipt integrity:
- add or update tests
- document expected behavior in README or threat model docs
