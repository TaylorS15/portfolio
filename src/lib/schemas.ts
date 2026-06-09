import { toolDefinition } from "@tanstack/ai";
import * as z from "zod";

export const modelsSchema = z.union([
  z.literal("Kimi-K2.6"),
  z.literal("GLM-4.7 Flash"),
  z.literal("GPT-OSS-120b"),
]);

export const getPersonalSummary = toolDefinition({
  name: "get_personal_summary",
  description:
    "Get a short summary on Taylor Svec about his developer history and interests.",
  outputSchema: z.string(),
});

export const getPortfolioSummary = toolDefinition({
  name: "get_portfolio_summary",
  description:
    "Get a short summary of Taylor Svec's portfolio tech stack and implementation details.",
  outputSchema: z.string(),
});

export type ModelsType = z.infer<typeof modelsSchema>;
