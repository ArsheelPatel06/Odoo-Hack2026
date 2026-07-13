"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib";

type DropdownItem = {
  id: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
};

type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
};

export function Dropdown({ trigger, items, align = "end", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {trigger}
      </button>
      {open ? (
        <div
          className={cn(
            "absolute top-[calc(100%+8px)] z-30 min-w-44 overflow-hidden rounded-card border border-subtle bg-popover p-1 shadow-elevated animate-scale-in",
            align === "end" ? "right-0" : "left-0"
          )}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className="flex w-full rounded-input px-3 py-2 text-left text-body-sm text-secondary hover:bg-muted-surface hover:text-primary disabled:opacity-50"
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Popover({ trigger, children, className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {trigger}
      </button>
      {open ? (
        <div className="absolute top-[calc(100%+8px)] z-30 min-w-56 rounded-card border border-subtle bg-popover p-3 shadow-elevated animate-scale-in">
          {children}
        </div>
      ) : null}
    </div>
  );
}

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
};

export function Tooltip({ content, children, className, position = "top" }: TooltipProps) {
  const positionClasses = {
    top: "bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2",
    bottom: "top-[calc(100%+8px)] left-1/2 -translate-x-1/2",
    left: "right-[calc(100%+8px)] top-1/2 -translate-y-1/2",
    right: "left-[calc(100%+8px)] top-1/2 -translate-y-1/2",
  };

  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 hidden rounded-input border border-subtle bg-slate-800 px-2.5 py-1 text-xs font-medium text-white shadow-soft group-hover:block whitespace-nowrap",
          positionClasses[position]
        )}
      >
        {content}
      </span>
    </span>
  );
}
