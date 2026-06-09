import { toolDefinition } from "@tanstack/ai";
import { safeParse } from "zod";
import * as z from "zod";

const serverTool = (name: string, description: string, filePath: string) => {
  return toolDefinition({
    name,
    description,
    outputSchema: z.string(),
  }).server(async () => {
    try {
      const response = await fetch(filePath);
      const data = await response.text();

      const result = safeParse(z.string(), data);
      if (!result.success) {
        return `Failure to call ${name}`;
      }

      return result.data;
    } catch (error) {
      console.log(error);
      return `Failure to call ${name}`;
    }
  });
};

export const getPersonalSummaryServer = serverTool(
  "get_personal_summary",
  "Get a short summary on Taylor Svec about his developer history and interests.",
  "/get_personal_summary.txt",
);

export const getPortfolioSummaryServer = serverTool(
  "get_portfolio_summary",
  "Get a short summary of Taylor Svec's portfolio tech stack and implementation details.",
  "/get_portfolio_summary.txt",
);
