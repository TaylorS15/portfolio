import { createFileRoute } from "@tanstack/react-router";
import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createWorkersAiChat } from "@cloudflare/tanstack-ai/adapters/workers-ai";
import { env } from "cloudflare:workers";
import {
  getPersonalSummary,
  modelsSchema,
  type ModelsType,
} from "#/lib/schemas";
import { safeParse } from "zod";
import * as z from "zod";

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

const getPersonalSummaryServer = getPersonalSummary.server(async () => {
  try {
    const response = await fetch("/get_personal_summary.txt");
    const data = await response.text();

    const result = safeParse(z.string(), data);
    if (!result.success) {
      return "Failure to call get_personal_summary";
    }

    return result.data;
  } catch (error) {
    console.log(error);
    return "Failure to call get_personal_summary";
  }
});

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
            tools: [getPersonalSummaryServer],
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
