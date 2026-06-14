import { Indicator } from "./indicator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { modelsSchema } from "#/lib/schemas";
import type { IndicatorStatus } from "#/lib/types";
import { useState } from "react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import type { ToolCallPart } from "@tanstack/ai-client";
import { Button } from "./ui/button";
import { type ModelsType } from "#/lib/schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProjectCard } from "./project-card";

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
  const [selectedModel, setSelectedModel] = useState<ModelsType>();

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
            className={`mb-2 w-max max-w-96 border border-mist-200 p-2 ${message.role === "assistant" ? "" : "ml-auto"}`}
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
                    <div
                      key={`${part.type}_${idx}`}
                      className="text-sm text-mist-700"
                    >
                      {part.content}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex h-18 items-end gap-2">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={250}
          className="h-full resize-none text-sm placeholder:text-mist-400"
          placeholder="Ask anything about myself, my projects, or even how this AI chat is built!"
        />

        <div className="flex flex-col gap-2">
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

      <div className="mt-2 flex h-8 items-center">
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
    </>
  );
}

const questionSuggestions = [
  "How did Taylor get started in software development?",
  "What kind of work is Taylor looking for right now?",
  "Tell me about the AI chat app Taylor built for a Slovenian law firm.",
  "What products is Taylor currently building?",
  "How does the AI chat in this portfolio actually work?",
  "What does Taylor mean by having a product-driven mindset?",
  "Which AI models can I chat with on this site, and what are the limits?",
];
