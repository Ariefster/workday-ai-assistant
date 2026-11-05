import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Zap } from "lucide-react";
import { tools } from "@/lib/tools";
import { Disclaimer } from "@/components/disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkPilot AI — Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, meeting summaries, task planning and research with AI." },
      { property: "og:title", content: "WorkPilot AI — Workplace Productivity Assistant" },
      { property: "og:description", content: "Automate emails, meeting summaries, task planning and research with AI." },
    ],
  }),
  component: Index,
});

const stats = [
  { icon: Zap, label: "AI tools", value: "5" },
  { icon: Clock, label: "Avg. time saved per task", value: "~15 min" },
  { icon: ShieldCheck, label: "Outputs you review & edit", value: "100%" },
];

function Index() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-hero p-8 text-primary-foreground shadow-glow md:p-12">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-primary-glow/30 blur-3xl" />
        <p className="text-sm font-medium uppercase tracking-widest opacity-80">AI Workplace Productivity Assistant</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold md:text-5xl">Do your best work. Let AI handle the busywork.</h1>
        <p className="mt-4 max-w-xl opacity-85">Draft emails, summarize meetings, plan your week and research topics — all from one workspace.</p>
        <Link to="/chat" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-warm px-5 py-2.5 text-sm font-semibold text-foreground transition hover:opacity-90">
          Start a conversation <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary"><s.icon className="size-5" /></div>
            <div>
              <div className="font-display text-xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Your AI tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.url} to={t.url} className="group rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:border-primary/50">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><t.icon className="size-5" /></div>
              <h3 className="mt-4 font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Open <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>
      <Disclaimer />
    </div>
  );
}
