import { VehicleCreateForm } from "@/modules/fleet/components";
import { PageHeader } from "@/shared/components/ui";

export default function FleetCreatePage() {
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <PageHeader title="Create Vehicle" description="Register a new fleet asset into the master vehicle registry." />
      <VehicleCreateForm />
    </div>
  );
}
