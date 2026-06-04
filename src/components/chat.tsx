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
import { useState } from "react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { Button } from "./ui/button";
import { type ModelsType } from "#/lib/schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Chat() {
  const [input, setInput] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<ModelsType>();

  const { messages, sendMessage, isLoading, clear } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    forwardedProps: { model: selectedModel },
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
                      <AccordionItem value="thinking">
                        <AccordionTrigger>Thinking</AccordionTrigger>
                        <AccordionContent className="text-sm text-mist-500 italic">
                          {part.content}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                }
                if (part.type === "text") {
                  return (
                    <div key={idx} className="text-sm text-mist-700">
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

      <form onSubmit={handleSubmit} className="mt-2 flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={250}
          className="resize-none text-sm placeholder:text-mist-400"
          placeholder="Ask anything about myself, my projects, or even how this AI chat is built!"
        />
        <Button
          type="submit"
          className="border border-mist-200 bg-mist-50 text-mist-500 hover:cursor-pointer hover:bg-mist-100"
        >
          Send
        </Button>
      </form>

      <div className="mt-2 flex h-8 items-center">
        <Indicator status={{ type: "complete" }} />
        <Button
          className="mr-2 ml-auto border border-mist-200 bg-mist-50 text-mist-500 hover:cursor-pointer hover:bg-mist-100"
          onClick={clear}
        >
          Clear Chat
        </Button>
        <Select
          value={selectedModel}
          onValueChange={(value) => setSelectedModel(value as ModelsType)}
        >
          <SelectTrigger className="h-6 w-36">
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
