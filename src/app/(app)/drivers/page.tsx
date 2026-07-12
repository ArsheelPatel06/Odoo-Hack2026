import Link from "next/link";
import { DriverRegistry } from "@/modules/drivers/components";
import { Button, PageHeader } from "@/shared/components/ui";

export default function DriversPage() {
  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="Driver Management"
          description="Operational workforce registry with compliance visibility for safety officers."
        />
        <Button asChild>
          <Link href="/drivers/new">Create driver</Link>
        </Button>
      </div>

      <DriverRegistry />
    </div>
  );
}
