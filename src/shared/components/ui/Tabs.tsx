"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/shared/lib";

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
};

export function Tabs({ items, defaultTabId, className }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);

  const active = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className={cn("space-y-4", className)}>
      <div role="tablist" className="inline-flex rounded-input border border-subtle bg-muted-surface p-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === active?.id}
            className={cn(
              "rounded-[10px] px-3 py-1.5 text-body-sm font-medium transition-colors duration-200",
              item.id === active?.id ? "bg-surface text-primary shadow-soft" : "text-muted hover:text-primary"
            )}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="animate-fade-in">
        {active?.content}
      </div>
    </div>
  );
}

type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const open = openId === item.id;

        return (
          <div key={item.id} className="overflow-hidden rounded-card border border-subtle bg-surface">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left text-body-md font-medium text-primary"
              onClick={() => setOpenId(open ? null : item.id)}
            >
              {item.title}
              <span className="text-muted">{open ? "−" : "+"}</span>
            </button>
            {open ? <div className="border-t border-subtle px-4 py-3 text-body-sm text-secondary">{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
