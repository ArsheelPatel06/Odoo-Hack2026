import { Check } from "lucide-react";
import { DISPATCH_STEPS } from "@/modules/trips/components/dispatch/constants";
import { cn } from "@/shared/lib";

type DispatchStepperProps = {
  currentStep: number;
};

export function DispatchStepper({ currentStep }: DispatchStepperProps) {
  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {DISPATCH_STEPS.map((step) => {
        const isActive = currentStep === step.id;
        const isComplete = currentStep > step.id;

        return (
          <li
            key={step.key}
            className={cn(
              "rounded-card border px-4 py-3 transition-all duration-200",
              isActive && "border-accent/30 bg-accent/5 shadow-soft",
              isComplete && "border-success/20 bg-success/5",
              !isActive && !isComplete && "border-subtle bg-surface"
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-xs font-semibold",
                  isComplete && "bg-success text-inverse",
                  isActive && "bg-accent text-inverse",
                  !isActive && !isComplete && "bg-muted-surface text-muted"
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : step.id}
              </span>
              <div>
                <p className="text-body-md font-medium text-primary">{step.label}</p>
                <p className="text-caption text-muted">{step.description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
