import { FuelRegistry } from "@/modules/financial/components";
import { PageHeader } from "@/shared/components/ui";

export default function FuelPage() {
  return (
    <div className="grid gap-8">
      <PageHeader
        title="Financial Operations"
        description="Fuel logs and operational costing that feed fleet profitability, ROI, and future dashboard KPIs."
      />
      <FuelRegistry />
    </div>
  );
}
