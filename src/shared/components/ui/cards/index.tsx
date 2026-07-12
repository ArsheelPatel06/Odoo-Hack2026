import type { ReactNode } from "react";
import { Card } from "../Card";
import { typography } from "@/shared/design-system";
import { cn } from "@/shared/lib";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  trend?: { value: string; positive?: boolean };
  className?: string;
};

export function MetricCard({ label, value, hint, trend, className }: MetricCardProps) {
  return (
    <Card className={cn("space-y-3", className)}>
      <p className={typography.label}>{label}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-display-md font-bold tracking-tight text-primary">{value}</p>
        {trend ? (
          <span className={cn("text-body-sm font-medium", trend.positive ? "text-success" : "text-danger")}>
            {trend.value}
          </span>
        ) : null}
      </div>
      {hint ? <p className={typography.caption}>{hint}</p> : null}
    </Card>
  );
}

type InformationCardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function InformationCard({ title, children, footer, className }: InformationCardProps) {
  return (
    <Card className={cn("space-y-4", className)}>
      <h3 className={typography.headingSm}>{title}</h3>
      <div className="text-body-md text-secondary">{children}</div>
      {footer}
    </Card>
  );
}

type StatisticCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export function StatisticCard({ title, value, description, icon, className }: StatisticCardProps) {
  return (
    <Card className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className={typography.label}>{title}</p>
        {icon}
      </div>
      <p className="text-heading-xl font-semibold text-primary">{value}</p>
      {description ? <p className={typography.caption}>{description}</p> : null}
    </Card>
  );
}

type ActionCardProps = {
  title: string;
  description: string;
  action: ReactNode;
  className?: string;
};

export function ActionCard({ title, description, action, className }: ActionCardProps) {
  return (
    <Card interactive className={cn("flex items-center justify-between gap-4", className)}>
      <div>
        <h3 className={typography.headingSm}>{title}</h3>
        <p className={cn(typography.bodySm, "mt-1")}>{description}</p>
      </div>
      {action}
    </Card>
  );
}

type TimelineCardProps = {
  title: string;
  events: Array<{ id: string; title: string; timestamp: string; description?: string }>;
  className?: string;
};

export function TimelineCard({ title, events, className }: TimelineCardProps) {
  return (
    <Card className={cn("space-y-4", className)}>
      <h3 className={typography.headingSm}>{title}</h3>
      <ol className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="rounded-input border border-subtle px-3 py-2">
            <div className="text-body-md font-medium text-primary">{event.title}</div>
            {event.description ? <p className="mt-1 text-body-sm text-muted">{event.description}</p> : null}
            <p className="mt-2 text-caption text-muted">{event.timestamp}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}

type EntityCardProps = {
  title: string;
  subtitle?: string;
  status?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export function VehicleCard({ title, subtitle, status, meta, className }: EntityCardProps) {
  return <EntityCard title={title} subtitle={subtitle} status={status} meta={meta} className={className} />;
}

export function DriverCard({ title, subtitle, status, meta, className }: EntityCardProps) {
  return <EntityCard title={title} subtitle={subtitle} status={status} meta={meta} className={className} />;
}

export function TripCard({ title, subtitle, status, meta, className }: EntityCardProps) {
  return <EntityCard title={title} subtitle={subtitle} status={status} meta={meta} className={className} />;
}

function EntityCard({ title, subtitle, status, meta, className }: EntityCardProps) {
  return (
    <Card interactive className={cn("space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={typography.headingSm}>{title}</h3>
          {subtitle ? <p className={cn(typography.bodySm, "mt-1")}>{subtitle}</p> : null}
        </div>
        {status}
      </div>
      {meta}
    </Card>
  );
}

type AlertCardProps = {
  title: string;
  description: string;
  tone?: "info" | "success" | "warning" | "danger";
  action?: ReactNode;
  className?: string;
};

const alertToneClasses = {
  info: "border-info/20 bg-info/5",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
  danger: "border-danger/20 bg-danger/5"
};

export function AlertCard({ title, description, tone = "info", action, className }: AlertCardProps) {
  return (
    <Card className={cn("border", alertToneClasses[tone], className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={typography.headingSm}>{title}</h3>
          <p className={cn(typography.bodySm, "mt-1")}>{description}</p>
        </div>
        {action}
      </div>
    </Card>
  );
}
