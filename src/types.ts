export type RiskLevel = "low" | "medium" | "high" | "critical";
export type PolicyAction = "allow" | "block" | "require_approval";

export interface PolicyRule {
  pattern: string;
  action: PolicyAction;
  severity: RiskLevel;
  reason?: string;
}

export interface PolicyProfile {
  name: string;
  defaults: {
    low: PolicyAction;
    medium: PolicyAction;
    high: PolicyAction;
    critical: PolicyAction;
  };
}

export interface SeatbeltConfig {
  rules: PolicyRule[];
  profiles?: Record<string, PolicyProfile["defaults"]>;
  settings?: {
    defaultProfile?: string;
    allowBaselinePatterns?: boolean;
  };
  baselineAllowPatterns?: string[];
}

export interface ClassifierReason {
  reason: string;
  confidence: number;
  kind: "exact" | "token_heuristic" | "regex";
}

export interface ClassifiedRisk {
  command: string;
  riskLevel: RiskLevel;
  riskScore: number;
  whyRisky: string[];
  blastRadius: string;
  approvalRequired: boolean;
  rollbackRecommended: boolean;
  matchedPatterns: string[];
  matchDetails: ClassifierReason[];
  remediation: string[];
}

export interface PolicyDecision {
  action: PolicyAction;
  severity: RiskLevel;
  approvalRequired: boolean;
  matchedRule?: PolicyRule;
}

export interface CheckpointRecord {
  id: string;
  createdAt: string;
  command: string;
  gitRoot: string;
  branch: string;
  headSha: string;
  dirty: boolean;
  changedFiles: number;
  stashRef?: string;
  status: "active" | "restored" | "failed";
}

export interface ExecutionResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface Receipt {
  id: string;
  timestamp: string;
  chainIndex?: number;
  previousReceiptHash?: string;
  receiptHash?: string;
  agentSessionId?: string;
  command: string;
  profile: string;
  dryRun: boolean;
  risk: {
    level: RiskLevel;
    score: number;
    whyRisky: string[];
    blastRadius: string;
    matchedPatterns: string[];
    matchDetails: ClassifierReason[];
    remediation: string[];
  };
  policy: {
    action: PolicyAction;
    approvalRequired: boolean;
    approvedByUser: boolean | null;
    matchedRule?: PolicyRule;
  };
  checkpoint: {
    available: boolean;
    id?: string;
  };
  execution: {
    executed: boolean;
    exitCode?: number;
  };
}

export interface AgentSession {
  agentSessionId: string;
  workspacePath: string;
  startedAt: string;
  protectedSurfaces: string[];
}
