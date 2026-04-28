# Generic Agent Wrapper Example

This example shows a simple local wrapper where an "agent" proposes commands and AgentSeatbelt gates execution.

No paid APIs, no cloud dependency, no secrets required.

## Flow

1. Agent proposes JSON command payload.
2. Wrapper sends command through `seatbelt run "<command>" --dry-run`.
3. Wrapper reads resulting action receipt.
4. Wrapper only executes real command path if policy outcome is safe.

## Run

```bash
npm run build
node examples/generic-agent-wrapper/wrapper.mjs
```
