import { createServerFn } from "@tanstack/react-start";
import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM = `You are a professional workplace productivity assistant. Write clear, well-structured, concise output in Markdown. Use headings and bullet lists where helpful. Never invent facts presented as certain; flag assumptions.`;

export const runAI = createServerFn({ method: "POST" })
  .validator((d: { instructions: string; messages: Msg[] }) => {
    if (!d || !Array.isArray(d.messages) || d.messages.length === 0) throw new Error("No input");
    const messages = d.messages.slice(-30).map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content).slice(0, 20000),
    }));
    return { instructions: String(d.instructions ?? "").slice(0, 4000), messages };
  })
  .handler(async ({ data }) => {
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: `${SYSTEM}\n\n${data.instructions}`,
        input: data.messages,
      });
      let text = "";
      for (const item of (res as { output?: unknown[] }).output ?? []) {
        const it = item as { type?: string; content?: { type?: string; text?: string }[] };
        if (it.type === "message")
          for (const c of it.content ?? []) if (c.type === "output_text") text += c.text ?? "";
      }
      return { text: text || "No response generated.", error: null as string | null };
    } catch (e) {
      console.error(e);
      if (e instanceof GatewayError) {
        if (e.httpStatus === 429) return { text: "", error: "Too many requests — please wait a moment and try again." };
        if (e.httpStatus === 402) return { text: "", error: "AI credits are exhausted. Please add credits to continue." };
      }
      return { text: "", error: "The AI request failed. Please try again." };
    }
  });
