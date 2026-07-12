import Link from "next/link";
import { routes } from "@/shared/constants/routes";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface/80 p-6 md:block">
        <div className="text-lg font-semibold">TransitOps</div>
        <nav className="mt-8 grid gap-2">
          {routes.app.map((route) => (
            <Link key={route.href} href={route.href} className="rounded-md px-3 py-2 text-sm text-muted">
              {route.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-h-screen p-6 md:pl-72">{children}</main>
    </div>
  );
}
