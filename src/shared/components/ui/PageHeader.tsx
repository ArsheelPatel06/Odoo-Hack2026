import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="space-y-1">
        <h1 className="text-heading-xl font-semibold tracking-tight text-primary">{title}</h1>
        {description ? <p className="text-body-md text-muted">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
