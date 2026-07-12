import { DriverCreateForm } from "@/modules/drivers/components";
import { PageHeader } from "@/shared/components/ui";

export default function DriverCreatePage() {
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <PageHeader title="Create Driver" description="Register a driver into the operational workforce registry." />
      <DriverCreateForm />
    </div>
  );
}
