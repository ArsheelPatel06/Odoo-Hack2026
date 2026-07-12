import { ExpenseCreateForm } from "@/modules/financial/components";
import { PageHeader } from "@/shared/components/ui";

export default function ExpenseCreatePage() {
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <PageHeader title="Add Expense" description="Record operational spend. Costs and ROI update automatically." />
      <ExpenseCreateForm />
    </div>
  );
}
