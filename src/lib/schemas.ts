import * as z from "zod";

export const modelsSchema = z.union([
  z.literal("Kimi-K2.6"),
  z.literal("GLM-4.7 Flash"),
  z.literal("GPT-OSS-120b"),
]);

export type ModelsType = z.infer<typeof modelsSchema>;
