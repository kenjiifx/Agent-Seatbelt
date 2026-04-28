# MCP Gateway Roadmap (v0.3 direction)

## Why this matters

Current AgentSeatbelt intercepts shell commands. Next step is intercepting agent tool calls before they become shell/file/network/cloud mutations.

## Vision

AgentSeatbelt becomes a policy gateway for MCP tools with the same deterministic decision pipeline used by CLI command enforcement.

## Decision pipeline

`tool request -> normalize action -> classify risk -> policy decision -> approval/block/allow -> receipt`

## Suggested interfaces

```ts
interface ToolRequest {
  toolName: string;
  arguments: Record<string, unknown>;
  sessionId?: string;
}

interface NormalizedAction {
  category: "shell" | "file" | "network" | "cloud" | "secrets";
  commandLike: string;
  blastRadius: "low" | "medium" | "high" | "critical";
}

interface PolicyDecision {
  action: "allow" | "block" | "require_approval";
  reason: string;
}

interface Receipt {
  id: string;
  timestamp: string;
  source: "cli" | "mcp";
  decision: PolicyDecision;
}
```

## Milestones

- v0.3: MCP request normalization + dry-run policy evaluation.
- v0.4: enforce mode for selected tool categories.
- v0.5: CI + team policy synchronization hooks.
