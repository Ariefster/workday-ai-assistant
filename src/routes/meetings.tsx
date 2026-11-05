import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkPilot AI" },
      { name: "description", content: "Summarize meeting notes into decisions and action items." },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkPilot AI" },
      { property: "og:description", content: "Summarize meeting notes into decisions and action items." },
    ],
  }),
  component: () => (
    <ToolPage
      title="Meeting Notes Summarizer"
      subtitle="Paste raw notes or a transcript to get a clean summary."
      icon={NotebookPen}
      instructions="ROLE: Executive assistant. TASK: Summarize the meeting. FORMAT sections: ## Summary, ## Key Decisions, ## Action Items (table: Task | Owner | Due date — use 'TBD' if unknown), ## Open Questions. Only use information in the notes."
      fields={[
        { name: "title", label: "Meeting title", type: "text", placeholder: "e.g. Weekly product sync" },
        { name: "notes", label: "Notes or transcript", type: "textarea", required: true, rows: 10, placeholder: "Paste your meeting notes here…" },
        { name: "detail", label: "Detail level", type: "select", options: ["Brief", "Standard", "Comprehensive"] },
      ]}
      buildPrompt={(v) => `MEETING: ${v.title || "Untitled"}\nDETAIL LEVEL: ${v.detail}\n\nNOTES:\n"""\n${v.notes}\n"""`}
    />
  ),
});
