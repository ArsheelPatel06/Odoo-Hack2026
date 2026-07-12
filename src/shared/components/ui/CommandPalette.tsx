"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SearchInput } from "./InputVariants";
import { cn } from "@/shared/lib";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Array<{ id: string; label: string; hint?: string; onSelect: () => void }>;
  className?: string;
};

export function CommandPalette({ open, onOpenChange, items, className }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }

      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  if (!open) return null;

  const filtered = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-overlay px-4 pt-24 backdrop-blur-[1px]">
      <div className={cn("w-full max-w-xl overflow-hidden rounded-dialog border border-subtle bg-card shadow-panel animate-scale-in", className)}>
        <div className="border-b border-subtle p-3">
          <SearchInput
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-body-sm text-muted">No commands found.</p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex w-full flex-col rounded-input px-3 py-2 text-left hover:bg-muted-surface"
                onClick={() => {
                  item.onSelect();
                  onOpenChange(false);
                  setQuery("");
                }}
              >
                <span className="text-body-md font-medium text-primary">{item.label}</span>
                {item.hint ? <span className="text-caption text-muted">{item.hint}</span> : null}
              </button>
            ))
          )}
        </div>
      </div>
      <button type="button" className="absolute inset-0 -z-10" aria-label="Close command palette" onClick={() => onOpenChange(false)} />
    </div>
  );
}
