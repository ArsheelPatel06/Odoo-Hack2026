import { EmptyState } from "@/shared/components/ui";

type ModuleShellProps = {
  title: string;
  description: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ModuleShell({
  title,
  description,
  emptyTitle = "Module shell ready",
  emptyDescription = "Business workflows and data views will be added in a future commit."
}: ModuleShellProps) {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center p-6 animate-fade-in">
      <EmptyState 
        title={`${title} - ${emptyTitle}`} 
        description={emptyDescription} 
        className="max-w-md w-full bg-white shadow-soft"
      />
    </div>
  );
}
