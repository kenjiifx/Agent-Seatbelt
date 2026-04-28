# AgentSeatbelt Threat Model (v0)

## Goal

Reduce risk from autonomous or semi-autonomous coding agents executing terminal commands in developer workspaces.

## Protected surfaces

- Terminal command execution
- Repository state and rollback
- Secret-bearing files and obvious key/token patterns
- Production-impact command paths

## In-scope threats

- Accidental secret reads from `.env` and key-like files
- Destructive filesystem commands
- High-impact deployment or infra commands
- Unreviewed direct pushes to `main`/`master`
- Loss of audit trail for command decisions

## Controls

- Deterministic risk classifier
- Rule-based policy engine (`allow`, `block`, `require_approval`)
- Action receipts with hash-chaining
- Workspace-scoped agent session IDs
- Git checkpoint metadata before risky execution

## Out of scope (v0)

- Full shell sandboxing or syscall-level isolation
- Data exfiltration detection across arbitrary network channels
- Enterprise policy distribution/control plane
