import { describe, expect, it } from "vitest";
import { z } from "zod";

const ReceiptSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  command: z.string(),
  profile: z.string(),
  dryRun: z.boolean(),
  risk: z.object({
    level: z.enum(["low", "medium", "high", "critical"]),
    score: z.number(),
    whyRisky: z.array(z.string()),
    blastRadius: z.string(),
    matchedPatterns: z.array(z.string()),
    matchDetails: z.array(
      z.object({
        reason: z.string(),
        confidence: z.number(),
        kind: z.enum(["exact", "token_heuristic", "regex"]),
      }),
    ),
    remediation: z.array(z.string()),
  }),
  policy: z.object({
    action: z.enum(["allow", "block", "require_approval"]),
    approvalRequired: z.boolean(),
    approvedByUser: z.boolean().nullable(),
    matchedRule: z.unknown().optional(),
  }),
  checkpoint: z.object({
    available: z.boolean(),
    id: z.string().optional(),
  }),
  execution: z.object({
    executed: z.boolean(),
    exitCode: z.number().optional(),
  }),
});

describe("receipt schema", () => {
  it("validates expected receipt shape", () => {
    const parsed = ReceiptSchema.safeParse({
      id: "rcpt_123",
      timestamp: new Date().toISOString(),
      command: "echo hi",
      profile: "dev",
      dryRun: true,
      risk: {
        level: "low",
        score: 20,
        whyRisky: ["No high-risk patterns detected."],
        blastRadius: "Limited local effect expected.",
        matchedPatterns: [],
        matchDetails: [],
        remediation: [],
      },
      policy: {
        action: "allow",
        approvalRequired: false,
        approvedByUser: null,
      },
      checkpoint: {
        available: false,
      },
      execution: {
        executed: false,
      },
    });
    expect(parsed.success).toBe(true);
  });
});
