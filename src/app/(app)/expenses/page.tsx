import { ExpenseRegistry } from "@/modules/financial/components";
import { PageHeader } from "@/shared/components/ui";

export default function ExpensesPage() {
  return (
    <div className="grid gap-8">
      <PageHeader
        title="Expense Management"
        description="Operational spend records aggregated into vehicle and trip cost summaries."
      />
      <ExpenseRegistry />
    </div>
  );
}
