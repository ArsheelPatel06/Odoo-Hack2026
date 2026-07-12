import { MaintenanceCreateForm } from "@/modules/maintenance/components";
import { PageHeader } from "@/shared/components/ui";

export default function MaintenanceCreatePage() {
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <PageHeader title="Create Maintenance" description="Open a maintenance request and send the vehicle to workshop through the workflow engine." />
      <MaintenanceCreateForm />
    </div>
  );
}
