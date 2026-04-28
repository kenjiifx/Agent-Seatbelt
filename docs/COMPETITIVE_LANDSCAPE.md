# Competitive Landscape

AgentSeatbelt is not claiming no competitors. The market is converging around agent safety, but categories solve different layers.

| Category | What they protect | Gap | AgentSeatbelt wedge |
|---|---|---|---|
| Prompt guardrails | Prompt/output content constraints | Usually not execution-time command enforcement | Runtime command policy before execution |
| AI code assistants | Code generation productivity | Not primarily built for command safety governance | Approvals and blocking in execution loop |
| Sandboxed execution envs | Isolated runtime boundaries | Heavier workflow friction, not always dev-first | Local-first CLI wedge with lightweight adoption |
| Endpoint security / EDR | Device/process anomaly monitoring | Not coding-agent specific approval UX | Agent-execution-aware policy and receipts |
| Secrets scanners | Secret leakage detection in code/files | Often post-hoc, not runtime command control | Pre-execution secret-read blocking |
| CI/CD policy tools | Pipeline policy controls | Limited to CI scope, not local agent execution | Starts local, expands into CI |
| Cloud posture/security tools | Cloud config and permissions | Not in local coding-agent command path | Command-level cloud mutation gating |
| Agent observability tools | Agent traces/events | Observability without hard execution controls | Enforcement + observability receipts |
| MCP gateways/agent security tools | Tool-call mediation | Emerging category, early market | CLI wedge now, MCP gateway path next |

## Why this wedge works

- Local-first and developer-first adoption path.
- Runtime enforcement before action, not after incident.
- Policy-as-code with approvals and hash-chained receipts.
- Expansion path from single developer to team/org governance.
