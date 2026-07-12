"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { Avatar, Button } from "@/shared/components/ui";
import { APP_ROUTES } from "@/shared/domain/routes";
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
        className="flex items-center gap-2 rounded-button border border-subtle bg-surface px-2 py-1.5 text-left transition duration-base hover:bg-muted-surface"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar name={user.name} size="sm" />
        <div className="hidden max-w-36 truncate sm:block">
          <div className="truncate text-body-sm font-medium text-primary">{user.name}</div>
          <div className="truncate text-caption text-muted">{user.role}</div>
        </div>
        <ChevronDown className={cn("size-4 text-muted transition duration-base", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-40 w-56 overflow-hidden rounded-card border border-subtle bg-popover p-1 shadow-panel animate-scale-in"
        >
          <div className="border-b border-subtle px-3 py-2">
            <div className="text-body-md font-medium text-primary">{user.name}</div>
            <div className="text-caption text-muted">{user.email}</div>
          </div>

          <Button asChild variant="ghost" className="mt-1 w-full justify-start">
            <Link href={APP_ROUTES.settings} onClick={() => setOpen(false)}>
              <Settings className="size-4" />
              Settings
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
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
