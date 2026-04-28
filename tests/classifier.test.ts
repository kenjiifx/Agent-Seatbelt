import { describe, expect, it } from "vitest";
import { classifyCommand } from "../src/risk/classifier.js";

describe("classifyCommand", () => {
  it("flags secret file reads as critical", () => {
    const risk = classifyCommand("cat .env");
    expect(risk.riskLevel).toBe("critical");
    expect(risk.riskScore).toBeGreaterThanOrEqual(90);
  });

  it("flags cloud commands as high", () => {
    const risk = classifyCommand("kubectl apply -f deploy.yml");
    expect(["high", "critical"]).toContain(risk.riskLevel);
  });

  it("marks normal command as low", () => {
    const risk = classifyCommand("echo hello");
    expect(risk.riskLevel).toBe("low");
  });
});
