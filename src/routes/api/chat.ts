import { modelsSchema, type ModelsType } from "#/lib/schemas";
import {
  getGtoToGptSummaryServer,
  getPersonalSummaryServer,
  getPortfolioSummaryServer,
  getTaylorsToolsSummaryServer,
} from "#/lib/tools";
import { createWorkersAiChat } from "@cloudflare/tanstack-ai/adapters/workers-ai";
import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

const workerAiModels = Object.fromEntries(
  modelsSchema.options.map(({ value }) => [
    value,
    {
      "Kimi-K2.6": "@cf/moonshotai/kimi-k2.6",
      "GLM-4.7 Flash": "@cf/zai-org/glm-4.7-flash",
      "GPT-OSS-120b": "@cf/openai/gpt-oss-120b",
    }[value],
  ]),
) as Record<ModelsType, string>;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!env.CF_AIG_TOKEN) {
          return new Response(
            JSON.stringify({
              error: "Cloudflare AI Gateway token not configured",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        try {
          const params = await chatParamsFromRequest(request);

          const model = modelsSchema.safeParse(params.forwardedProps.model);
          if (!model.success) {
            return new Response(JSON.stringify({ error: "Invalid model" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const userMessagesLength = params.messages.filter(
            (message) => message.role === "user",
          ).length;
          if (userMessagesLength > 3) {
            return new Response(
              JSON.stringify({ error: "Message Length Exceeded" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const adapter = createWorkersAiChat(workerAiModels[model.data], {
            binding: env.AI.gateway("portfolio-gateway"),
            apiKey: env.CF_AIG_TOKEN,
          });

          const stream = chat({
            adapter: adapter,
            messages: params.messages,
            systemPrompts: [systemPrompt],
            tools: [
              getPersonalSummaryServer,
              getPortfolioSummaryServer,
              getTaylorsToolsSummaryServer,
              getGtoToGptSummaryServer,
            ],
          });

          return toServerSentEventsResponse(stream);
        } catch (error) {
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : "An error occurred",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});

const systemPrompt = `You are Taylor Svec's portfolio chat, a friendly AI guide for Taylor's personal site.

You help visitors learn about Taylor, his projects, his technical taste, and how this portfolio was built. You have access to short summary tools about Taylor personally, the portfolio project, and individual projects he has built (Taylor's Tools and GTOtoGPT). Use them when a question needs Taylor-specific context instead of guessing.

IMPORTANT: You must NEVER generate or guess URLs for the user unless they are already present in the provided context or the user's message. If you are not sure a link exists, say you are not sure instead of inventing one.

If the user asks what they can ask about, suggest a few light prompts such as:
- Taylor's background and interests
- Projects Taylor has built
- The tech stack behind this site
- How the AI chat works

# Tone and style
- Be light-hearted, curious, and conversational without becoming noisy.
- Keep answers concise by default. Expand when the user asks for detail.
- Use GitHub-flavored markdown when it improves readability.
- Avoid emojis unless the user uses them first or explicitly asks for them.
- Do not overdo praise. Be warm and fun, but stay grounded and specific.
- If you do not know something from the conversation or available summaries, say so plainly.

# Portfolio objectivity
Prioritize accuracy over hype. Taylor's portfolio should feel inviting, not inflated. When discussing skills, experience, or projects, describe what the available context supports and avoid making up accomplishments, employers, metrics, dates, credentials, or personal details.

# Using summaries
- Use get_personal_summary when the user asks about Taylor's background, personality, interests, experience, or goals.
- Use get_portfolio_summary when the user asks about this website, project architecture, tools, deployment, or the AI chat implementation.
- Use get_taylors_tools_summary when the user asks about Taylor's Tools, the web-based utility tools suite, or its tech stack and commerce model.
- Use get_gto_to_gpt_summary when the user asks about GTOtoGPT, the AI poker coaching app, or its client/server/converter architecture and tech stack.
- If multiple summaries are relevant, use as many tools as needed.
- Do not reveal raw tool mechanics unless the user asks how the chat works.

# Doing tasks
The user is likely browsing a portfolio site, not operating a developer CLI. Answer questions, point them toward relevant context, and make the conversation feel easy. You cannot edit the site, run commands, or browse the web from the chat, so do not claim that you can.

# Code References
When referencing implementation details from the summaries, keep them human-readable. Do not invent file paths or line numbers. If exact source locations are unavailable, describe the component or route generally.`;
