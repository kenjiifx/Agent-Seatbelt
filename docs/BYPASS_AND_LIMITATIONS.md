# Bypass and Limitations (v0)

AgentSeatbelt is an enforcement layer in the commands it sees. It is not full machine control.

## Current limitations

- Commands run outside the Seatbelt wrapper are not intercepted.
- Shell aliases/functions are not universal enforcement.
- No OS-level sandboxing is provided.
- Cloud credential misuse still requires least-privilege IAM controls.
- Rollback metadata cannot recover every mutation type.
- Receipts prove what Seatbelt observed, not every action on the host.

## Trust boundaries

- In scope: command classification, policy decisions, approval/block, receipt logging.
- Out of scope: full endpoint hardening, network egress enforcement, host forensics.

## How we plan to close gaps

- Shell proxy mode for stronger command-path coverage.
- MCP gateway for tool-call enforcement before shell/network actions.
- IDE integrations for tighter agent execution hooks.
- CI enforcement mode for non-interactive policy gates.
- Optional local daemon for stronger enforcement continuity.
- Team policy sync and signed receipt roots.
