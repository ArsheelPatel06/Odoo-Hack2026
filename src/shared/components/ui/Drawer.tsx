"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/shared/lib";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  side?: "right" | "left";
  className?: string;
};

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = "right",
  className
}: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-overlay backdrop-blur-[1px]"
        aria-label="Close drawer"
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={cn(
          "absolute top-0 flex h-full w-full max-w-md flex-col border-subtle bg-card shadow-panel animate-slide-up",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-subtle px-5 py-4">
          <div>
            <h2 className="text-heading-md font-semibold">{title}</h2>
            {description ? <p className="mt-1 text-body-sm text-muted">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close drawer">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
