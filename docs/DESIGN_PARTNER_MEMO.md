# Design Partner Memo

## What AgentSeatbelt does

AgentSeatbelt enforces local runtime policy for AI coding agent command execution, blocks/approves risky actions, and writes tamper-evident action receipts.

## What feedback we need

- Which command classes are highest risk in your environment.
- Which integration surface you need first (local CLI, CI, IDE, MCP tools).
- What approval workflow is acceptable for daily engineering use.

## Pilot shape

- 30-minute guided setup and demo.
- One week of trial usage in a non-production repo workflow.
- Feedback call on false positives, missing controls, and UX friction.

## Important constraints

- No cloud required initially.
- Local-first by default.
- No paid APIs required.
