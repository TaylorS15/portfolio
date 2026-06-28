import { modelsSchema, type ModelsType } from "#/lib/schemas";
import type { IndicatorStatus } from "#/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ToolCallPart } from "@tanstack/ai-client";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { Indicator } from "./indicator";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type ChatStatus = ReturnType<typeof useChat>["status"];
type ChatMessages = ReturnType<typeof useChat>["messages"];

function getIndicatorStatus({
  messages,
  status,
}: {
  messages: ChatMessages;
  status: ChatStatus;
}): IndicatorStatus {
  const activeToolCall = messages
    .at(-1)
    ?.parts.find(
      (part): part is ToolCallPart =>
        part.type === "tool-call" && part.state !== "complete",
    );

  if (activeToolCall) {
    return { type: "fetching", fetching: activeToolCall.name };
  }

  if (status === "submitted") {
    return { type: "loading" };
  }

  if (status === "streaming") {
    return { type: "streaming" };
  }

  //Reverted to generic error message.
  //Tanstack AI seems to discard server sent error messages.
  if (status === "error") {
    return {
      type: "error",
      error: "There has been an error! Try again in a new chat",
    };
  }

  if (messages.length > 0) {
    return { type: "complete" };
  }

  return { type: "waiting" };
}

export function Chat() {
  const [input, setInput] = useState<string>("");
  const [selectedModel, setSelectedModel] =
    useState<ModelsType>("GLM-4.7 Flash");

  const { messages, sendMessage, isLoading, clear, status } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    forwardedProps: { model: selectedModel },
  });

  const indicatorStatus = getIndicatorStatus({
    messages,
    status,
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && selectedModel) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <>
      <div className="h-96 overflow-y-scroll">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 w-10/12 max-w-[36rem] border border-mist-200 p-2 md:w-max ${message.role === "assistant" ? "" : "ml-auto"}`}
          >
            <p className="mb-1 text-xs font-light text-mist-400">
              {message.role === "assistant" ? "Assistant" : "You"}
            </p>
            <div>
              {message.parts.map((part, idx) => {
                if (part.type === "thinking") {
                  return (
                    <Accordion type="single" collapsible>
                      <AccordionItem
                        key={`${part.type}_${idx}`}
                        value="thinking"
                      >
                        <AccordionTrigger>Thinking</AccordionTrigger>
                        <AccordionContent className="text-sm text-mist-500 italic">
                          {part.content}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                }
                if (part.type === "tool-call") {
                  return (
                    <div key={`${part.type}_${idx}`} className="mt-2">
                      <p className="text-xs font-medium">Tool Call</p>
                      <p className="mt-1 text-xs text-purple-500">
                        {part.name}
                      </p>
                    </div>
                  );
                }
                if (part.type === "text") {
                  return (
                    <Streamdown
                      key={`${part.type}_${idx}`}
                      className="text-sm"
                      animated
                      isAnimating={status === "streaming"}
                    >
                      {part.content}
                    </Streamdown>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="mt-2 flex flex-col items-end gap-2 md:h-18 md:flex-row"
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={250}
            className="h-full resize-none text-sm placeholder:text-mist-400"
            placeholder="Ask anything about myself, my projects, or even how this AI chat is built!"
          />

          <div className="flex w-full flex-col gap-2 md:w-auto">
            <Button
              type="button"
              onClick={() => {
                const randomQuestion =
                  questionSuggestions[
                    Math.floor(Math.random() * questionSuggestions.length)
                  ];
                setInput(randomQuestion);
              }}
              className="border border-mist-200 bg-mist-50 text-mist-500 hover:cursor-pointer hover:bg-mist-100"
            >
              Question Suggestion
            </Button>
            <Button
              type="submit"
              className="border border-mist-200 bg-mist-50 text-mist-500 hover:cursor-pointer hover:bg-mist-100"
            >
              Send
            </Button>
          </div>
        </form>

        <div className="mt-2 flex grow items-center">
          <Indicator status={indicatorStatus} />
          <Button
            className="mr-2 ml-auto border border-mist-200 bg-mist-50 text-mist-500 hover:cursor-pointer hover:bg-mist-100"
            onClick={() => {
              clear();
              setInput("");
            }}
          >
            Clear Chat
          </Button>
          <Select
            value={selectedModel}
            onValueChange={(value) => setSelectedModel(value as ModelsType)}
          >
            <SelectTrigger className="h-6 w-40">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {modelsSchema.options.map(({ value }, index) => (
                  <SelectItem value={value} key={`${value}_${index}`}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

const questionSuggestions = [
  // Personal
  "How did building Minecraft mods at 13 shape Taylor's path into software?",
  "What kinds of AI or product-focused work is Taylor looking for now?",
  "How does Taylor think about product design beyond just writing code?",
  "What drew Taylor into building with AI when GPT-3.5 launched?",
  "How did Taylor go from a landscaping landing page to legal AI and poker tools?",
  // Portfolio
  "How does this portfolio's Cloudflare Workers AI chat stream responses?",
  "Why build this portfolio with TanStack Start instead of Next.js?",
  "What makes the portfolio's React 19 and Tailwind v4 stack bleeding-edge?",
  "How does the chat use server-side tools to answer questions about Taylor?",
  "What are the model choices and limits inside this portfolio chat?",
  // AIKrpan
  "How did AIKrpan help lawyers work with legal documents?",
  "What frontend work did Taylor own on AIKrpan?",
  "Why was an in-app PDF viewer important for AIKrpan's legal workflow?",
  // Taylor's Tools
  "How does Taylor's Tools let people pay only after previewing the result?",
  "Why is Taylor's Tools designed to work with or without an account?",
  "How does the transcription tool use browser-based FFmpeg before Whisper?",
  "What do the Image-to-PDF, transcription, and PDF signing tools do?",
  // GTOtoGPT
  "How does GTOtoGPT combine solver data with GPT instead of being a wrapper?",
  "What happens inside GTOtoGPT's multi-stage poker RAG pipeline?",
  "How does the converter turn PioSOLVER files into LLM-readable knowledge?",
  "Why is GTOtoGPT split into client, server, and converter repositories?",
];
