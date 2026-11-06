import { ShieldAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-xl border border-warm/40 bg-accent/50 p-4 text-sm text-accent-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0" />
      <div>
        <strong>Responsible AI:</strong>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>AI outputs can be incomplete, outdated or wrong. Review before sending.</li>
          <li>Check facts, figures, names and dates against a reliable source.</li>
          <li>Avoid entering confidential or personal information you would not share.</li>
          <li>You remain responsible for anything you send on to colleagues or clients.</li>
        </ul>
      </div>
    </div>
  );
}
