import { useState, type ComponentType } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Eye, Loader2, Pencil, RotateCcw, Wand2, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Disclaimer } from "@/components/disclaimer";
import { runAI } from "@/lib/ai.functions";

export type Field<K extends string = string> =
  | { name: K; label: string; type: "text"; placeholder?: string; required?: boolean }
  | { name: K; label: string; type: "textarea"; placeholder?: string; required?: boolean; rows?: number }
  | { name: K; label: string; type: "select"; options: string[] };

export function ToolPage<const K extends string>({
  title,
  subtitle,
  icon: Icon,
  fields,
  instructions,
  buildPrompt,
}: {
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  fields: Field<K>[];
  instructions: string;
  buildPrompt: (v: Record<K, string>) => string;
}) {
  const call = useServerFn(runAI);
  const [values, setValues] = useState<Record<K, string>>(
    () => Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? f.options[0] : ""])) as Record<K, string>,
  );
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    const missing = fields.find((f) => f.type !== "select" && f.required && !values[f.name]?.trim());
    if (missing) {
      toast.error(`Please fill in "${missing.label}".`);
      return;
    }
    setLoading(true);
    try {
      const r = await call({ data: { instructions, messages: [{ role: "user", content: buildPrompt(values) }] } });
      if (r.error) toast.error(r.error);
      else {
        setOutput(r.text);
        setEditing(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
          <Icon className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-card">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.type === "text" && (
                <Input id={f.name} placeholder={f.placeholder} value={values[f.name]}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              )}
              {f.type === "textarea" && (
                <Textarea id={f.name} rows={f.rows ?? 4} placeholder={f.placeholder} value={values[f.name]}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              )}
              {f.type === "select" && (
                <Select value={values[f.name]} onValueChange={(v) => setValues({ ...values, [f.name]: v })}>
                  <SelectTrigger id={f.name}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          <Button className="w-full" size="lg" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? "Generating…" : "Generate"}
          </Button>
        </section>

        <section className="flex min-h-[420px] flex-col rounded-2xl border bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
            <span className="font-display text-sm font-semibold">Output</span>
            {output && (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
                  {editing ? <Eye /> : <Pencil />}{editing ? "Preview" : "Edit"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                  <Copy />Copy
                </Button>
                <Button variant="ghost" size="sm" onClick={download}><Download />Save</Button>
                <Button variant="ghost" size="sm" onClick={generate} disabled={loading}><RotateCcw />Redo</Button>
              </div>
            )}
          </div>
          <div className="flex-1 p-5">
            {loading && !output ? (
              <div className="space-y-3">
                {[90, 75, 85, 60].map((w) => <div key={w} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />)}
              </div>
            ) : !output ? (
              <div className="flex h-full min-h-[300px] items-center justify-center text-center text-sm text-muted-foreground">
                Fill in the details and click Generate. <br />You can edit the result afterwards.
              </div>
            ) : editing ? (
              <Textarea className="min-h-[360px] font-mono text-sm" value={output} onChange={(e) => setOutput(e.target.value)} />
            ) : (
              <div className="prose-output"><ReactMarkdown>{output}</ReactMarkdown></div>
            )}
          </div>
        </section>
      </div>
      <Disclaimer />
    </div>
  );
}
