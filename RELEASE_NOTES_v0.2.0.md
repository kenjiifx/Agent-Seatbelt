# AgentSeatbelt v0.2.0

## Summary

v0.2.0 upgrades AgentSeatbelt from MVP into a stronger, trust-oriented runtime safety layer with chain verification and runtime status observability, while staying local-first and deterministic.

## Highlights

- `seatbelt verify` validates action receipt hash-chain integrity.
- `seatbelt status` reports config/session/git/checkpoint/receipt trust signals.
- Session mode hardening reuses valid workspace sessions and rejects invalid payloads.
- Receipt chain utilities now support tamper detection workflows.

## Reliability and launch readiness

- CI checks for build, tests, typecheck, lint, and release dry-run.
- Improved repository governance and support docs.
- npm publish preparation and metadata hardening.
