"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { useSession } from "@/shared/providers/SessionProvider";
import { cn } from "@/shared/lib";

type ProfileMenuProps = {
  onLogout: () => void;
};

export function ProfileMenu({ onLogout }: ProfileMenuProps) {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2 text-left transition hover:bg-slate-700/60"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserRound className="size-4 text-muted" />
        <div className="hidden max-w-40 truncate sm:block">
          <div className="truncate text-xs font-medium text-text">{user.name}</div>
          <div className="truncate text-[11px] text-muted">{user.role}</div>
        </div>
        <ChevronDown className={cn("size-4 text-muted transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-40 w-56 rounded-card border border-border bg-surface p-2 shadow-panel"
        >
          <div className="border-b border-border px-3 py-2">
            <div className="text-sm font-medium text-text">{user.name}</div>
            <div className="text-xs text-muted">{user.email}</div>
          </div>
          <Button
            variant="ghost"
            className="mt-1 w-full justify-start"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      ) : null}
    </div>
  );
}
