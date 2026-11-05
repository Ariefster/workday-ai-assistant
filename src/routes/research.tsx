import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkPilot AI" },
      { name: "description", content: "Get structured AI research briefings on any workplace topic." },
      { property: "og:title", content: "AI Research Assistant — WorkPilot AI" },
      { property: "og:description", content: "Get structured AI research briefings on any workplace topic." },
    ],
  }),
  component: () => (
    <ToolPage
      title="AI Research Assistant"
      subtitle="Get a structured briefing to kickstart your research."
      icon={Search}
      instructions="ROLE: Senior research analyst. TASK: Produce a research briefing. FORMAT: ## Overview, ## Key Findings, ## Considerations & Risks, ## Suggested Next Steps, ## Sources to Verify (types of sources to consult). State uncertainty clearly; your knowledge may be outdated."
      fields={[
        { name: "topic", label: "Research topic or question", type: "textarea", required: true, rows: 4, placeholder: "e.g. Best practices for hybrid work policies in 2026" },
        { name: "audience", label: "Audience", type: "select", options: ["Executives", "Team members", "Clients", "Technical experts"] },
        { name: "depth", label: "Depth", type: "select", options: ["Quick overview", "Standard briefing", "Deep dive"] },
        { name: "focus", label: "Specific focus (optional)", type: "text", placeholder: "e.g. cost impact, legal aspects" },
      ]}
      buildPrompt={(v) =>
        `TOPIC: ${v.topic}\nAUDIENCE: ${v.audience}\nDEPTH: ${v.depth}\nFOCUS: ${v.focus || "general"}`
      }
    />
  ),
});
