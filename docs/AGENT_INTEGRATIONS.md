# Agent Integrations

AgentSeatbelt currently integrates as a command wrapper and policy gate in agent workflows.

## 1) Cursor

Current integration:
- Wrap agent-proposed commands through `seatbelt run "<command>"`.
- Use `--dry-run` in early rollout.

Planned integration:
- native policy-aware command broker in editor workflows.

## 2) Claude Code

Current integration:
- command wrapper for generated shell actions.
- require approvals for high/critical command classes.

Planned integration:
- policy hooks around command execution API.

## 3) OpenAI Codex CLI

Current integration:
- wrap all generated command execution through Seatbelt.

Planned integration:
- direct execution proxy with richer metadata capture.

## 4) Gemini CLI

Current integration:
- wrapper-based command gate.

Planned integration:
- native command interception path if/when available.

## 5) GitHub Actions / CI

Current integration:
- run Seatbelt in CI dry-run or enforce mode for command mutation checks.

Planned integration:
- non-interactive policy pack mode with fail/allow gating in pipelines.

## 6) Generic agent wrapper

See:
- `examples/generic-agent-wrapper/README.md`
- `examples/generic-agent-wrapper/wrapper.mjs`

## Integration status model

- Current: command wrapper.
- Next: MCP/tool-call gateway.
- Later: shell proxy/command broker with stronger universal enforcement.
