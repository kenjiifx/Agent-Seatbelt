import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import {
  ClassifiedRisk,
  PolicyAction,
  PolicyDecision,
  PolicyRule,
  RiskLevel,
  SeatbeltConfig,
} from "../types.js";

export const DEFAULT_CONFIG: SeatbeltConfig = {
  rules: [
    { pattern: "cat .env", action: "block", severity: "critical" },
    { pattern: "type .env", action: "block", severity: "critical" },
    { pattern: "Get-Content .env", action: "block", severity: "critical" },
    { pattern: "rm -rf", action: "require_approval", severity: "critical" },
    { pattern: "del /s", action: "require_approval", severity: "critical" },
    { pattern: "rmdir /s", action: "require_approval", severity: "critical" },
    {
      pattern: "git push origin main",
      action: "require_approval",
      severity: "critical",
    },
    {
      pattern: "git push origin master",
      action: "require_approval",
      severity: "critical",
    },
    { pattern: "vercel --prod", action: "require_approval", severity: "critical" },
    { pattern: "firebase deploy", action: "require_approval", severity: "critical" },
  ],
  profiles: {
    dev: {
      low: "allow",
      medium: "allow",
      high: "require_approval",
      critical: "require_approval",
    },
    strict: {
      low: "allow",
      medium: "require_approval",
      high: "require_approval",
      critical: "block",
    },
    ci: {
      low: "allow",
      medium: "require_approval",
      high: "block",
      critical: "block",
    },
  },
  settings: {
    defaultProfile: "dev",
    allowBaselinePatterns: true,
  },
  baselineAllowPatterns: [],
};

function severityRank(level: RiskLevel): number {
  return { low: 0, medium: 1, high: 2, critical: 3 }[level];
}

function defaultActionForSeverity(
  level: RiskLevel,
  config: SeatbeltConfig,
  profile: string,
): PolicyAction {
  const profileDefaults = config.profiles?.[profile] ?? config.profiles?.dev;
  if (profileDefaults) {
    return profileDefaults[level];
  }
  if (level === "low") {
    return "allow";
  }
  if (level === "medium") {
    return "allow";
  }
  return "require_approval";
}

export function loadConfig(
  cwd: string = process.cwd(),
): { config: SeatbeltConfig; path: string } {
  const configPath = path.join(cwd, ".seatbelt", "config.yml");
  if (!fs.existsSync(configPath)) {
    return { config: DEFAULT_CONFIG, path: configPath };
  }
  const parsed = YAML.parse(fs.readFileSync(configPath, "utf8")) as SeatbeltConfig;
  return {
    config: {
      ...DEFAULT_CONFIG,
      ...parsed,
      rules: parsed.rules ?? DEFAULT_CONFIG.rules,
      profiles: parsed.profiles ?? DEFAULT_CONFIG.profiles,
      settings: { ...DEFAULT_CONFIG.settings, ...(parsed.settings ?? {}) },
      baselineAllowPatterns:
        parsed.baselineAllowPatterns ?? DEFAULT_CONFIG.baselineAllowPatterns,
    },
    path: configPath,
  };
}

function findMatchingRule(command: string, rules: PolicyRule[]): PolicyRule | undefined {
  const normalized = command.toLowerCase();
  return rules
    .filter((rule) => normalized.includes(rule.pattern.toLowerCase()))
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))[0];
}

export function resolvePolicyDecision(
  risk: ClassifiedRisk,
  config: SeatbeltConfig,
  profile: string,
): PolicyDecision {
  const matchedRule = findMatchingRule(risk.command, config.rules);
  const baselineAllowed =
    config.settings?.allowBaselinePatterns &&
    (config.baselineAllowPatterns ?? []).some((p) =>
      risk.command.toLowerCase().includes(p.toLowerCase()),
    );

  if (baselineAllowed && risk.riskLevel === "low") {
    return {
      action: "allow",
      severity: risk.riskLevel,
      approvalRequired: false,
    };
  }

  const action = matchedRule?.action ?? defaultActionForSeverity(risk.riskLevel, config, profile);
  const approvalRequired = action === "require_approval";

  return {
    action,
    severity: matchedRule?.severity ?? risk.riskLevel,
    approvalRequired,
    matchedRule,
  };
}
