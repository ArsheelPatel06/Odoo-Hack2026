import { LoadingSkeleton } from "@/shared/components/ui";

export function ShellLoading() {
  return (
    <div className="grid gap-6 animate-fade-in">
      <div className="grid gap-3">
        <LoadingSkeleton className="h-8 w-56" />
        <LoadingSkeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <LoadingSkeleton className="h-28 rounded-card" />
        <LoadingSkeleton className="h-28 rounded-card" />
        <LoadingSkeleton className="h-28 rounded-card" />
      </div>

      <LoadingSkeleton className="h-[420px] rounded-card" />
    </div>
  );
}
