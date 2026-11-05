import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkPilot AI" },
      { name: "description", content: "Turn goals into prioritized, scheduled task plans with AI." },
      { property: "og:title", content: "AI Task Planner — WorkPilot AI" },
      { property: "og:description", content: "Turn goals into prioritized, scheduled task plans with AI." },
    ],
  }),
  component: () => (
    <ToolPage
      title="AI Task Planner"
      subtitle="Turn goals and to-dos into a realistic, prioritized plan."
      icon={ListChecks}
      instructions="ROLE: Productivity coach. TASK: Build a task plan. FORMAT: ## Priorities (use Eisenhower: Urgent/Important), ## Schedule (table: Time/Day | Task | Est. duration | Priority), ## Tips. Keep the plan realistic within the time available."
      fields={[
        { name: "goals", label: "Goals & tasks", type: "textarea", required: true, rows: 7, placeholder: "e.g. Finish report, prep client demo, review 3 PRs, gym" },
        { name: "timeframe", label: "Timeframe", type: "select", options: ["Today", "This week", "Two weeks", "This month"] },
        { name: "hours", label: "Available hours per day", type: "text", placeholder: "e.g. 6" },
        { name: "constraints", label: "Constraints or deadlines", type: "textarea", rows: 3, placeholder: "e.g. Meetings 10–11am, demo due Thursday" },
      ]}
      buildPrompt={(v) =>
        `TIMEFRAME: ${v.timeframe}\nHOURS PER DAY: ${v.hours || "about 8"}\nCONSTRAINTS: ${v.constraints || "none"}\n\nGOALS AND TASKS:\n${v.goals}`
      }
    />
  ),
});
