import { Chat } from "#/components/chat";
import { ProjectCard } from "#/components/project-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Copy } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="m-4 flex flex-col items-center lg:mx-48 lg:my-24">
      <div className="flex w-full max-w-[72rem] flex-col gap-4 border-x border-t border-mist-300 p-4 md:flex-row">
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-72 bg-mist-200" />
          <h1 className="my-auto text-2xl font-bold text-neutral-900">
            Taylor Svec
          </h1>
        </div>

        <div className="flex flex-col justify-end gap-4">
          <p className="text-sm">
            I'm a software developer passionate about building robust web and
            mobile applications. I've found using React, TypeScript, and many of
            the modern tooling stacks the industry is actively moving toward,
            are the best tools for bringing ideas to production.
          </p>
          <p className="text-sm">
            I love exploring how AI can solve practical, real-world problems,
            from automating tedious workflows to uncovering insights buried in
            complex datasets. I'm driven by the challenge of creating
            data-driven tools that translate raw information into actionable
            outcomes, ultimately helping people make better decisions and
            businesses operate more efficiently.
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-[72rem] flex-col border-x border-t border-mist-300 p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-neutral-800">
            Projects & Experience
          </h2>

          <ProjectCard
            name="Rolled"
            description="Bankroll, session, and hand tracking for live poker players."
            links={[""]}
          />
        </div>
      </div>

      <div className="flex w-full max-w-[72rem] flex-col border-x border-t border-mist-300 p-4">
        <Chat />
      </div>

      <div className="flex w-full max-w-[72rem] flex-col border border-mist-300 p-4">
        <h2 className="mb-2 text-lg font-medium text-neutral-800">Contact</h2>

        <div className="flex w-min flex-row items-center gap-2 hover:cursor-pointer hover:underline">
          <Tooltip>
            <TooltipTrigger
              className="group flex flex-row items-center gap-2 hover:cursor-pointer"
              onClick={() => navigator.clipboard.writeText("tsvec15@yahoo.com")}
            >
              <p className="text-sm">tsvec15@yahoo.com</p>
              <Copy
                size={15}
                className="transition group-active:translate-y-0.5 group-active:scale-80"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xxs">Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <a
          target="_blank"
          href="https://github.com/TaylorS15"
          className="flex w-min flex-row items-center gap-2 hover:cursor-pointer hover:underline"
        >
          <p className="text-sm">Github</p>
          <ArrowUpRight size={15} />
        </a>
        <a target="_blank" href="https://github.com/TaylorS15">
          <a
            target="_blank"
            href="https://linkedin.com/taylorsvec"
            className="flex w-min flex-row items-center gap-2 hover:cursor-pointer hover:underline"
          >
            <p className="text-sm">LinkedIn</p>
            <ArrowUpRight size={15} />
          </a>
        </a>
      </div>
    </main>
  );
}
