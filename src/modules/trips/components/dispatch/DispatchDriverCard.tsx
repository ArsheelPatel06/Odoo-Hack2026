import { UserRound } from "lucide-react";
import { buildDriverComplianceIndicators } from "@/modules/drivers/services/driver-compliance";
import { DRIVER_STATUS_COLORS } from "@/shared/domain/constants";
import type { Driver } from "@/shared/domain/models";
import { Badge, Button, Card, StatusBadge } from "@/shared/components/ui";
import { cn } from "@/shared/lib";

const toneMap = { success: "success", primary: "primary", warning: "warning", danger: "danger", muted: "muted" } as const;

type DispatchDriverCardProps = {
  driver: Driver;
  selected: boolean;
  onSelect: () => void;
};

export function DispatchDriverCard({ driver, selected, onSelect }: DispatchDriverCardProps) {
  const tone = toneMap[DRIVER_STATUS_COLORS[driver.status] as keyof typeof toneMap] ?? "muted";
  const compliance = buildDriverComplianceIndicators(driver);
  const hasBlocker = compliance.some((item) => item.active && item.tone === "danger");

  return (
    <Card
      interactive
      className={cn("space-y-4", selected && "ring-2 ring-accent/40 shadow-elevated", hasBlocker && "border-danger/30")}
      onClick={hasBlocker ? undefined : onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-input bg-muted-surface text-accent">
            <UserRound className="size-5" />
          </span>
          <div>
            <p className="text-heading-sm font-semibold text-primary">{driver.name}</p>
            <p className="text-body-sm text-muted">{driver.licenseNumber}</p>
          </div>
        </div>
        <StatusBadge label={driver.status} tone={tone} />
      </div>

      <dl className="grid grid-cols-2 gap-2 text-body-sm">
        <div>
          <dt className="text-muted">Safety score</dt>
          <dd className="font-medium text-primary">★ {driver.safetyScore}</dd>
        </div>
        <div>
          <dt className="text-muted">Category</dt>
          <dd className="font-medium text-primary">{driver.licenseCategory}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-1.5">
        {compliance
          .filter((item) => item.active)
          .map((item) => (
            <Badge key={item.key} tone={item.tone}>
              {item.label}
            </Badge>
          ))}
      </div>

      <Button
        className="w-full"
        variant={selected ? "secondary" : hasBlocker ? "outline" : "primary"}
        disabled={hasBlocker}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        {hasBlocker ? "Not dispatchable" : selected ? "Selected" : "Assign driver"}
      </Button>
    </Card>
  );
}
