import { FuelCreateForm } from "@/modules/financial/components";
import { PageHeader } from "@/shared/components/ui";

export default function FuelCreatePage() {
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <PageHeader title="Log Fuel" description="Record fuel consumption for a completed trip through workflow validation." />
      <FuelCreateForm />
    </div>
  );
}
