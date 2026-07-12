"use client";

import Link from "next/link";
import { CheckCheck } from "lucide-react";
import { SHELL_NOTIFICATIONS } from "@/shared/domain/constants/shell";
import { Button, NotificationBell } from "@/shared/components/ui";
import { Drawer } from "@/shared/components/ui/Drawer";
import { useShellStore } from "@/shared/store/shell-store";
import { cn } from "@/shared/lib";

const categoryRoutes: Record<(typeof SHELL_NOTIFICATIONS)[number]["category"], string> = {
  trips: "/trips",
  maintenance: "/maintenance",
  compliance: "/compliance",
  fuel: "/fuel",
  analytics: "/analytics"
};

export function NotificationCenter() {
  const { notificationCenterOpen, setNotificationCenterOpen } = useShellStore();
  const unreadCount = SHELL_NOTIFICATIONS.filter((item) => item.unread).length;

  return (
    <>
      <NotificationBell count={unreadCount} onClick={() => setNotificationCenterOpen(true)} />

      <Drawer
        open={notificationCenterOpen}
        onOpenChange={setNotificationCenterOpen}
        title="Notification center"
        description="Operational signals across fleet, trips, and compliance."
        side="right"
        className="max-w-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-body-sm text-muted">{unreadCount} unread</p>
          <Button variant="ghost" size="sm" className="gap-2">
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        </div>

        <div className="grid gap-2">
          {SHELL_NOTIFICATIONS.map((notification) => (
            <Link
              key={notification.id}
              href={categoryRoutes[notification.category]}
              onClick={() => setNotificationCenterOpen(false)}
              className={cn(
                "block rounded-card border border-subtle bg-surface px-4 py-3 transition duration-base hover:border-strong hover:shadow-soft",
                notification.unread && "border-accent/20 bg-accent/5"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-body-md font-medium text-primary">{notification.title}</p>
                  <p className="mt-1 text-body-sm text-muted">{notification.body}</p>
                </div>
                {notification.unread ? <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" aria-hidden /> : null}
              </div>
              <p className="mt-2 text-caption text-muted">{notification.timestamp}</p>
            </Link>
          ))}
        </div>
      </Drawer>
    </>
  );
}
