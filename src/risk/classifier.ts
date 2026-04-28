import { ClassifiedRisk, ClassifierReason, RiskLevel } from "../types.js";

interface RuleSignal {
  pattern: RegExp;
  severity: RiskLevel;
  reason: string;
  blastRadius: string;
  confidence: number;
  kind: ClassifierReason["kind"];
  remediation: string[];
}

const signals: RuleSignal[] = [
  {
    pattern: /\b(cat|type|get-content)\s+.*\.env\b/i,
    severity: "critical",
    reason: "Reads .env file content, likely exposing secrets.",
    blastRadius: "Leaked credentials can compromise environments and accounts.",
    confidence: 0.98,
    kind: "regex",
    remediation: ["Use .env.example or redact values before sharing output."],
  },
  {
    pattern: /\b(id_rsa|\.pem\b|token|secret|api[_-]?key)\b/i,
    severity: "critical",
    reason: "Command references potential secret material.",
    blastRadius: "Sensitive keys or tokens may be exfiltrated or misused.",
    confidence: 0.9,
    kind: "token_heuristic",
    remediation: ["Avoid reading secrets directly. Use secret managers or masked output."],
  },
  {
    pattern: /\brm\s+-rf\b|\bdel\s+\/s\b|\brmdir\s+\/s\b/i,
    severity: "critical",
    reason: "Destructive recursive delete detected.",
    blastRadius: "Can permanently remove large parts of repository or system data.",
    confidence: 0.96,
    kind: "regex",
    remediation: ["Run on a narrow path first or use dry-run/list flags where supported."],
  },
  {
    pattern: /\bgit\s+push\s+origin\s+(main|master)\b/i,
    severity: "critical",
    reason: "Direct push to protected primary branch.",
    blastRadius: "May deploy or break production workflows immediately.",
    confidence: 0.97,
    kind: "regex",
    remediation: ["Push to a feature branch and open a PR first."],
  },
  {
    pattern: /\bgit\s+push\s+--force(\s+origin\s+(main|master))?\b/i,
    severity: "critical",
    reason: "Force push can rewrite shared branch history.",
    blastRadius: "Can destroy collaborative history and trigger downstream failures.",
    confidence: 0.98,
    kind: "regex",
    remediation: ["Avoid force pushing shared branches; use PR merge workflows."],
  },
  {
    pattern: /\b(vercel\s+--prod|firebase\s+deploy|terraform\s+apply)\b/i,
    severity: "critical",
    reason: "Production or infrastructure apply command detected.",
    blastRadius: "Potential live environment changes with broad impact.",
    confidence: 0.94,
    kind: "exact",
    remediation: ["Run preview/plan commands before production deployment."],
  },
  {
    pattern: /\b(aws|gcloud|az|kubectl)\b/i,
    severity: "high",
    reason: "Cloud or cluster control-plane command detected.",
    blastRadius: "Can change cloud infrastructure, workloads, or security posture.",
    confidence: 0.8,
    kind: "token_heuristic",
    remediation: ["Confirm target account/project/cluster before execution."],
  },
  {
    pattern: /\b(npm\s+install|pnpm\s+install|yarn\s+add)\b/i,
    severity: "medium",
    reason: "Dependency install may execute postinstall scripts.",
    blastRadius: "Third-party scripts can alter local environment or files.",
    confidence: 0.82,
    kind: "exact",
    remediation: ["Review package trust and consider --ignore-scripts if appropriate."],
  },
  {
    pattern: /\b(curl|wget)\b.*\|\s*(sh|bash|zsh)\b/i,
    severity: "critical",
    reason: "Piped network script execution detected.",
    blastRadius: "Remote script can execute arbitrary commands on the host.",
    confidence: 0.97,
    kind: "regex",
    remediation: ["Download and inspect scripts before execution."],
  },
];

const levelRank: Record<RiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

function toScore(level: RiskLevel, confidence: number): number {
  const base = { low: 15, medium: 45, high: 70, critical: 90 }[level];
  return Math.min(100, Math.round(base + confidence * 10));
}

export function classifyCommand(command: string): ClassifiedRisk {
  const matches = signals.filter((signal) => signal.pattern.test(command));
  const highest = matches.sort(
    (a, b) => levelRank[b.severity] - levelRank[a.severity] || b.confidence - a.confidence,
  )[0];

  const riskLevel: RiskLevel = highest?.severity ?? "low";
  const riskScore = toScore(
    riskLevel,
    matches.length > 0 ? Math.max(...matches.map((m) => m.confidence)) : 0.2,
  );
  const whyRisky = matches.map((m) => m.reason);
  const blastRadius = highest?.blastRadius ?? "Limited local effect expected.";
  const matchedPatterns = matches.map((m) => m.pattern.source);
  const matchDetails: ClassifierReason[] = matches.map((m) => ({
    reason: m.reason,
    confidence: m.confidence,
    kind: m.kind,
  }));
  const remediation = Array.from(new Set(matches.flatMap((m) => m.remediation)));

  return {
    command,
    riskLevel,
    riskScore,
    whyRisky: whyRisky.length > 0 ? whyRisky : ["No high-risk patterns detected."],
    blastRadius,
    approvalRequired: riskLevel === "high" || riskLevel === "critical",
    rollbackRecommended: riskLevel === "high" || riskLevel === "critical",
    matchedPatterns,
    matchDetails,
    remediation,
  };
}
