import { describe, expect, it } from "vitest";
import { classifyCommand } from "../src/risk/classifier.js";
import { DEFAULT_CONFIG, resolvePolicyDecision } from "../src/policy/policyEngine.js";

describe("resolvePolicyDecision", () => {
  it("uses explicit matching rule when present", () => {
    const risk = classifyCommand("vercel --prod");
    const decision = resolvePolicyDecision(risk, DEFAULT_CONFIG, "dev");
    expect(decision.action).toBe("require_approval");
  });

  it("uses strict profile defaults", () => {
    const risk = classifyCommand("npm install");
    const decision = resolvePolicyDecision(risk, DEFAULT_CONFIG, "strict");
    expect(decision.action).toBe("require_approval");
  });

  it("allows low risk by default", () => {
    const risk = classifyCommand("echo ok");
    const decision = resolvePolicyDecision(risk, DEFAULT_CONFIG, "dev");
    expect(decision.action).toBe("allow");
  });
});
