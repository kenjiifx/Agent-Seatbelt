# Security Policy

AgentSeatbelt is designed to be local-first and deterministic for developer trust.

## Security guarantees

- Local-first runtime: policy checks and command gating run on your machine.
- No telemetry: AgentSeatbelt does not phone home for analytics.
- No cloud upload: command content, configs, and action receipts stay local by default.
- Deterministic policy engine: decisions are rule-driven, explainable, and reproducible.
- Optional baseline seeding (`--seed-baseline`) is local-only, disabled by default, and never uploads shell history.

## Trust boundaries

- Protects actions that execute through AgentSeatbelt command paths.
- Captures and verifies receipts for actions AgentSeatbelt observes.
- Does not claim visibility into actions executed outside Seatbelt wrappers.

## Non-goals (v0)

- Not a replacement for endpoint security or sandboxing.
- Not a full secret scanner for all file formats and data flows.
- Not an IAM/policy manager for cloud provider accounts.
- Not universal host enforcement without shell/IDE/CI integration hooks.

## Receipt integrity model

- Receipts are hash-chained (`previousReceiptHash` -> `receiptHash`).
- `seatbelt verify` detects tampering in observed receipt history.
- Chain integrity reflects what Seatbelt saw, not all host activity.

## Reporting vulnerabilities

Please report security issues privately by opening a GitHub Security Advisory (preferred) in this repository.

If that is not available, email `alammoosa07@gmail.com` with minimal reproduction details and avoid sending live secrets. We will coordinate a private follow-up.
