# Changelog

All notable changes to this project are documented in this file.

## Unreleased

### Changed
- GitHub Actions workflow updated to Node 24-compatible action/runtime settings.
- CI install path validated with `npm ci` lockfile-synced checks.

## v0.2.0 - 2026-04-28

### Added
- CI workflow with build, tests, typecheck, lint, and release dry-run checks.
- Contributor and governance docs (`CONTRIBUTING`, `CODE_OF_CONDUCT`, issue/PR templates).
- Threat model documentation.
- Receipt hash-chaining metadata (`chainIndex`, `previousReceiptHash`, `receiptHash`).
- Session hardening tests and receipt chain tests.
- `seatbelt verify` command to validate receipt chain integrity.
- `seatbelt status` command to summarize runtime readiness and trust signals.

### Changed
- Session mode hardening with validation and workspace scoping.
- npm publish preparation metadata and release scripts.
- README tightened for investor + senior developer launch positioning.
- Version upgraded to `0.2.0`.

## v0.1.0 - 2026-04-28

### Added
- TypeScript CLI with `init`, `run`, `logs`, `rollback`, and `doctor`.
- Deterministic risk classifier and policy engine with profile support.
- Secret-read blocking defaults and approval flow for higher-risk commands.
- Git checkpoint creation and rollback metadata.
- Local JSON action receipts with filtered table/json/ndjson views.
- `seatbelt agent dev` protected session mode with `.seatbelt/session.json`.
- Receipt linkage via `agentSessionId` when a session is active.
- Launch demo scripts (`demo.sh`, `demo.ps1`) for safe reproducible runs.
- Security policy and MIT license.

### Changed
- README tightened for investor/developer launch positioning.
- First-run guidance added to CLI help and command output.

### Quality
- Tests for classifier, policy, receipt schema, and agent session persistence.
