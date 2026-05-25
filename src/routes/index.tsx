import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="grid min-h-dvh grid-cols-[4rem_1px_1fr_1px_4rem] grid-rows-[4rem_1px_1fr_1px_1fr_1px_4rem] lg:grid-cols-[16rem_1px_1fr_1px_16rem] lg:grid-rows-[4rem_1px_1fr_1px_1fr_1px_4rem]">
      <div className="col-start-2 row-span-full bg-mist-200" />
      <div className="col-start-4 row-span-full bg-mist-200" />
      <div className="col-span-full row-start-2 bg-mist-200" />
      <div className="col-span-full row-start-4 bg-mist-200" />
      <div className="col-span-full row-start-6 bg-mist-200" />

      <div className="col-span-1 col-start-3 row-start-3 flex flex-col items-center justify-between md:flex-row">
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="aspect-square w-72 bg-mist-200" />
          <div className="flex h-full flex-1 flex-col justify-center gap-2">
            <h1 className="text-2xl font-light text-neutral-900">
              Taylor Svec
            </h1>
            <p className="max-w-[32rem] text-sm">
              I'm a software developer passionate about building web and mobile
              applications using React, Typescript, and modern tooling that the
              industry is moving towards.
            </p>
            <p className="max-w-[32rem] text-sm">
              I love exploring ways AI can solve practical problems and creating
              data-driven tools that help people and businesses thrive.
            </p>
            <p className="max-w-[32rem] text-sm">
              I am always eager to start working on something new!
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-1 col-start-3 row-start-5 flex flex-1 flex-col md:flex-row">
        <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row">
          <h2 className="text-lg font-medium text-neutral-800">Projects</h2>

          <div className="flex flex-row items-center gap-4">
            <p className="text-neutral-500">Rolled</p>
            <p className="text-neutral-500">-</p>
            <p className="text-sm text-neutral-500">
              Bankroll, session, and hand tracking for live poker players.
            </p>
            <Link to="/" className="my-auto">
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
