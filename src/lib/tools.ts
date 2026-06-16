import { toolDefinition } from "@tanstack/ai";
import { safeParse } from "zod";
import * as z from "zod";
import { env } from "cloudflare:workers";

const serverTool = (name: string, description: string, filePath: string) => {
  return toolDefinition({
    name,
    description,
    inputSchema: z.object({}),
    outputSchema: z.string(),
  }).server(async () => {
    try {
      const response = await env.ASSETS.fetch(
        new URL(filePath, "https://assets.local"),
      );
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

export const getTaylorsToolsSummaryServer = serverTool(
  "get_taylors_tools_summary",
  "Get a short summary on the web app Taylors Tools and what tech stack it uses.",
  "/get_taylors_tools_summary.txt",
);

export const getGtoToGptSummaryServer = serverTool(
  "get_gto_to_gpt_summary",
  "Get a short summary on the AI poker coaching web app GTOtoGPT, what it does, and the tech stack across its client, server, and converter repos.",
  "/get_gto_to_gpt_summary.txt",
);

export const getAiKrpanSummaryServer = serverTool(
  "get_aikrpan_summary",
  "Get a short summary on AIKrpan, the AI legal document chat app Taylor built for a Slovenian law firm, and the tech stack it uses.",
  "/get_aikrpan_summary.txt",
);
