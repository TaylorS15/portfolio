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
      <div className="flex flex-row items-start gap-4">
        <p className="mt-1">*</p>
        <p className="">{name}</p>
        <p className="text-neutral-500">-</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      {links.map((link, index) => (
        <a href={link} target="_blank" key={`${link}_${index}`}>
          <ArrowUpRight />
        </a>
      ))}
    </div>
  );
}
