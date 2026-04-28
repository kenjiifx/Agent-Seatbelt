# Changelog

All notable changes to this project are documented in this file.

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
