import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import YAML from "yaml";
import { afterEach, describe, expect, it } from "vitest";
import { runInit } from "../src/commands/init.js";

const tempDirs: string[] = [];
const cwdStack: string[] = [];

afterEach(() => {
  const prev = cwdStack.pop();
  if (prev) {
    process.chdir(prev);
  }
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

function makeTempWorkspace(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seatbelt-init-test-"));
  tempDirs.push(dir);
  return dir;
}

describe("runInit policy-pack/profile options", () => {
  it("applies policy-pack and profile to generated config", () => {
    const workspace = makeTempWorkspace();
    const original = process.cwd();
    cwdStack.push(original);
    process.chdir(workspace);

    fs.mkdirSync(path.join(workspace, "policy-packs"), { recursive: true });
    fs.writeFileSync(
      path.join(workspace, "policy-packs", "production-safe.yml"),
      YAML.stringify({
        rules: [{ pattern: "vercel --prod", action: "block", severity: "critical" }],
        settings: { defaultProfile: "strict", allowBaselinePatterns: false },
        baselineAllowPatterns: [],
      }),
      "utf8",
    );

    runInit({ policyPack: "production-safe", profile: "strict" });

    const configPath = path.join(workspace, ".seatbelt", "config.yml");
    const config = YAML.parse(fs.readFileSync(configPath, "utf8")) as {
      settings?: { defaultProfile?: string };
      rules?: Array<{ pattern: string }>;
    };
    expect(config.settings?.defaultProfile).toBe("strict");
    expect(config.rules?.some((r) => r.pattern === "vercel --prod")).toBe(true);
  });
});
