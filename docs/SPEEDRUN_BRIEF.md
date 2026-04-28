# AgentSeatbelt Speedrun Brief

## 1) One-liner

AgentSeatbelt is the runtime security layer between AI agents and real-world execution.

## 2) 60-second pitch

AI coding agents are moving from suggestion tools to execution systems. Once an agent can run commands, edit repos, install packages, access secrets, and deploy, the core problem becomes runtime control. AgentSeatbelt is a local-first runtime firewall that enforces policy, asks for approvals, blocks dangerous actions, and writes tamper-evident audit receipts before execution. We start with developer terminal/repo workflows and expand toward team and org-wide agent runtime governance.

## 3) Problem

- AI agents can execute high-blast-radius actions quickly.
- Developer machines and CI pipelines lack agent-native policy controls.
- Existing controls are fragmented across endpoint tools, CI policy, and cloud IAM.

## 4) Why now

- Agent usage in coding workflows is rapidly increasing.
- Agents now perform execution, not just code generation.
- Teams need enforcement and auditability at decision time, not after incident response.

## 5) Product

- Local CLI runtime firewall for agent-executed commands.
- Deterministic policy engine with approvals and blocking.
- Action receipts with hash-chain integrity.
- Session context and rollback metadata.

## 6) Initial wedge

Local-first command/runtime enforcement for coding agents in developer repos.

## 7) Target users

- Developers using Cursor, Claude Code, Codex, Gemini CLI.
- Security/devsecops engineers at startups.
- Platform engineers managing CI safety boundaries.

## 8) ICP

Startups (5-200 engineers) actively using coding agents in production-bound repos.

## 9) Expansion path

- v0: local terminal/repo enforcement.
- v1: coding agent wrappers/integrations.
- v2: CI and MCP tool-call policy gateway.
- v3: team policy bundles + centralized audit sync.
- v4: org-wide agent runtime governance.

## 10) Competitive landscape

- Prompt guardrails, sandboxed runtimes, EDR, secrets scanning, CI policy tools.
- Most do not sit directly in the coding-agent execution loop with local-first developer UX.

## 11) Differentiation

- Local-first by default.
- Deterministic policy + approvals before command execution.
- Agent-session-aware receipts and hash chaining.
- Developer-first wedge with upward security expansion.

## 12) Moat

- Workflow placement in agent execution path.
- Action receipt corpus and policy defaults tuned for coding-agent operations.
- Integration surface across local dev + CI + tool-call gateways.

## 13) Product roadmap

- Agent wrapper integrations.
- MCP gateway policy layer.
- CI enforcement mode.
- Team policy management and signed receipts.

## 14) Traction placeholders

- GitHub stars: TBD
- npm downloads: TBD
- Devs interviewed: TBD
- Design partners: TBD
- Pilots: TBD
- Waitlist: TBD

## 15) Demo script

Use `demos/speedrun-demo.md` plus `demos/speedrun-demo.sh` / `demos/speedrun-demo.ps1`.

## 16) Founder narrative placeholders

- Why this team understands agent execution risk: TBD
- Why now is non-consensus but inevitable: TBD
- Why this wedge wins distribution: TBD

## 17) Application answer drafts

- Problem: AI agents are execution systems without runtime controls.
- Solution: policy, approvals, and audit trails before execution.
- Why us: developer-first wedge with clear expansion path into runtime governance.

## What we must prove before applying

- 10-20 developer interviews.
- 3-5 recorded demo reactions.
- npm package published.
- GitHub release visible.
- Landing page live.
- Waitlist form live.
- 1 Cursor/Claude/Codex integration demo.
- 1 CI demo.
- 1 MCP/tool-call demo stub.
- 1 security engineer quote/testimonial if possible.
