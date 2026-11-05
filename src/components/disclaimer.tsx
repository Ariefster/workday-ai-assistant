import { ShieldAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-xl border border-warm/40 bg-accent/50 p-4 text-sm text-accent-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0" />
      <p>
        <strong>Responsible AI:</strong> Content is AI-generated and may contain errors or bias. Review and edit
        before use, verify facts independently, and avoid entering confidential or personal data.
      </p>
    </div>
  );
}
