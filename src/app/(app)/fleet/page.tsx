import Link from "next/link";
import { VehicleRegistry } from "@/modules/fleet/components";
import { Button, PageHeader } from "@/shared/components/ui";

export default function FleetPage() {
  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="Fleet Management"
          description="Functional fleet registry module. Status lifecycle is controlled exclusively by the workflow engine."
        />
        <Button asChild>
          <Link href="/fleet/new">Create vehicle</Link>
        </Button>
      </div>

      <VehicleRegistry />
    </div>
  );
}
