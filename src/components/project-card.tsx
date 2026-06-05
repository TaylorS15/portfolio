import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function ProjectCard({
  name,
  description,
  links,
}: {
  name: string;
  description: string;
  links: string[];
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-4">
        <p className="mt-1">*</p>
        <p className="">{name}</p>
        <p className="text-neutral-500">-</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      {links.map((link, index) => (
        <Link to={link} key={`${link}_${index}`}>
          <ArrowUpRight />
        </Link>
      ))}
    </div>
  );
}
