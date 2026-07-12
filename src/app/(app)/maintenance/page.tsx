import Link from "next/link";
import { MaintenanceRegistry } from "@/modules/maintenance/components";
import { Button, PageHeader } from "@/shared/components/ui";

export default function MaintenancePage() {
  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="Maintenance Management"
          description="Vehicle service operations that protect fleet availability through workflow-controlled lifecycle."
        />
        <Button asChild>
          <Link href="/maintenance/new">Create maintenance</Link>
        </Button>
      </div>

      <MaintenanceRegistry />
    </div>
  );
}
