import { EmptyState, PageHeader } from "@/shared/components/ui";

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
    <div className="grid gap-6 animate-fade-in">
      <PageHeader title={title} description={description} />
      <EmptyState title={emptyTitle} description={emptyDescription} />
    </div>
  );
}
