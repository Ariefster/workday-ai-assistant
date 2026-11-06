import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Check, Loader2, Pencil, SendHorizonal, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer } from "@/components/disclaimer";
import { runAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat Assistant — WorkPilot AI" },
      { name: "description", content: "Chat with an AI assistant about any workplace task." },
      { property: "og:title", content: "AI Chat Assistant — WorkPilot AI" },
      { property: "og:description", content: "Chat with an AI assistant about any workplace task." },
    ],
  }),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string };
const suggestions = [
  "How do I give constructive feedback to a colleague?",
  "Write a 30-60-90 day plan for a new project manager",
  "Tips to run more effective meetings",
];

function Chat() {
  const call = useServerFn(runAI);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: text.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await call({
        data: { instructions: "ROLE: Friendly, expert workplace assistant. Answer helpfully and concisely.", messages: next },
      });
      if (r.error) toast.error(r.error);
      else setMessages([...next, { role: "assistant", content: r.text }]);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-4xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">AI Chat Assistant</h1>
          <p className="text-sm text-muted-foreground">Ask anything about your work. Click the pencil to edit a reply.</p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])}><Trash2 />Clear</Button>
        )}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto rounded-2xl border bg-card p-4 shadow-card md:p-6">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow"><Bot className="size-7" /></div>
            <p className="text-muted-foreground">How can I help you today?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition hover:border-primary">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
              {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
            </div>
            {m.role === "user" ? (
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">{m.content}</div>
            ) : (
              <div className="group min-w-0 flex-1">
                {editIdx === i ? (
                  <Textarea className="min-h-40 text-sm" value={m.content}
                    onChange={(e) => setMessages(messages.map((x, j) => (j === i ? { ...x, content: e.target.value } : x)))} />
                ) : (
                  <div className="prose-output"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                )}
                <Button variant="ghost" size="sm" className="mt-1 h-7 text-muted-foreground" onClick={() => setEditIdx(editIdx === i ? null : i)}>
                  {editIdx === i ? <><Check />Done</> : <><Pencil />Edit</>}
                </Button>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Thinking…</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-card">
        <Textarea rows={1} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message…"
          className="max-h-40 min-h-11 resize-none border-0 shadow-none focus-visible:ring-0"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send"><SendHorizonal /></Button>
      </form>
      <Disclaimer />
    </div>
  );
}
