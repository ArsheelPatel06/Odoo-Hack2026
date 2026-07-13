import { AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";
import type { DispatchValidationSummary } from "@/modules/trips/types";
import { countPassingChecks } from "@/modules/trips/components/dispatch/helpers";
import { AlertCard, Card, ProgressBar } from "@/shared/components/ui";
import { cn } from "@/shared/lib";

type DispatchValidationPanelProps = {
  validation: DispatchValidationSummary | null;
  compact?: boolean;
  title?: string;
};

export function DispatchValidationPanel({ validation, compact, title = "Dispatch Readiness" }: DispatchValidationPanelProps) {
  if (!validation) {
    return (
      <Card className="space-y-3">
        <h3 className="text-heading-sm font-semibold text-primary">{title}</h3>
        <p className="text-body-sm text-muted">Create a trip draft to begin live validation.</p>
      </Card>
    );
  }

  const passed = countPassingChecks(validation.checks);
  const total = validation.checks.length;
  const progress = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-heading-sm font-semibold text-primary">{title}</h3>
          <p className="mt-1 text-body-sm text-muted">
            {passed} of {total} checks passing
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-caption font-medium",
            validation.readyToDispatch ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          )}
        >
          {validation.readyToDispatch ? "Ready" : "Blocked"}
        </span>
      </div>

      <ProgressBar value={progress} label="Validation progress" />

      <div className={cn("grid gap-2", compact && "max-h-72 overflow-y-auto pr-1")}>
        {validation.checks.map((check) => (
          <div
            key={check.key}
            className={cn(
              "flex items-start gap-3 rounded-input border px-3 py-2.5",
              check.passed ? "border-success/20 bg-success/5" : "border-danger/20 bg-danger/5"
            )}
          >
            {check.passed ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            ) : (
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
            )}
            <div>
              <p className="text-body-md font-medium text-primary">{check.label}</p>
              <p className="text-body-sm text-muted">{check.message}</p>
            </div>
          </div>
        ))}
      </div>

      {!validation.readyToDispatch ? (
        <AlertCard
          tone="warning"
          title="Dispatch blocked"
          description="Resolve failing checks before releasing this trip to the fleet."
        />
      ) : null}
    </Card>
  );
}

export function DispatchValidationPlaceholder() {
  return (
    <Card className="flex items-center gap-3 border-dashed">
      <CircleDashed className="size-5 text-muted" />
      <p className="text-body-sm text-muted">Validation checks appear once route and assignments are in progress.</p>
    </Card>
  );
}
