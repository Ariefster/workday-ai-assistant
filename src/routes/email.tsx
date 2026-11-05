import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkPilot AI" },
      { name: "description", content: "Generate professional workplace emails with AI." },
      { property: "og:title", content: "Smart Email Generator — WorkPilot AI" },
      { property: "og:description", content: "Generate professional workplace emails with AI." },
    ],
  }),
  component: () => (
    <ToolPage
      title="Smart Email Generator"
      subtitle="Describe what you need — get a ready-to-send email."
      icon={Mail}
      instructions="ROLE: Expert business communication writer. TASK: Write one email. FORMAT: Start with '**Subject:** ...' then the email body with greeting and sign-off. Use placeholders like [Your Name] for unknown details."
      fields={[
        { name: "recipient", label: "Recipient", type: "text", placeholder: "e.g. Client, my manager, HR team" },
        { name: "purpose", label: "Purpose & key points", type: "textarea", required: true, rows: 5, placeholder: "e.g. Follow up on the Q3 proposal, ask for feedback by Friday" },
        { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise"] },
        { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
      ]}
      buildPrompt={(v) =>
        `CONTEXT:\n- Recipient: ${v.recipient || "unspecified"}\n- Tone: ${v.tone}\n- Length: ${v.length}\n\nPURPOSE AND KEY POINTS:\n${v.purpose}`
      }
    />
  ),
});
