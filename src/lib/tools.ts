import { toolDefinition } from "@tanstack/ai";
import { safeParse } from "zod";
import * as z from "zod";

export const getPersonalSummaryServer = toolDefinition({
  name: "get_personal_summary",
  description:
    "Get a short summary on Taylor Svec about his developer history and interests.",
  outputSchema: z.string(),
}).server(async () => {
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
