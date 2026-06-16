import * as z from "zod";

export const modelsSchema = z.union([
  z.literal("GLM-4.7 Flash"),
  z.literal("GPT-OSS-120b"),
  z.literal("Kimi-K2.6"),
]);

export type ModelsType = z.infer<typeof modelsSchema>;
