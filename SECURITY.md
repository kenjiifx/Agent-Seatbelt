# Security Policy

AgentSeatbelt is designed to be local-first and deterministic for developer trust.

## Security guarantees

- Local-first runtime: policy checks and command gating run on your machine.
- No telemetry: AgentSeatbelt does not phone home for analytics.
- No cloud upload: command content, configs, and action receipts stay local by default.
- Deterministic policy engine: decisions are rule-driven, explainable, and reproducible.
- Optional baseline seeding (`--seed-baseline`) is local-only, disabled by default, and never uploads shell history.

## Non-goals (v0)

- Not a replacement for endpoint security or sandboxing.
- Not a full secret scanner for all file formats and data flows.
- Not an IAM/policy manager for cloud provider accounts.

## Reporting vulnerabilities

Please report security issues privately by opening a GitHub Security Advisory (preferred) in this repository.

If that is not available, email `alammoosa07@gmail.com` with minimal reproduction details and avoid sending live secrets. We will coordinate a private follow-up.
