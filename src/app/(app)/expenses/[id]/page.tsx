import { ExpenseDetailView } from "@/modules/financial/components";

type ExpenseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExpenseDetailPage({ params }: ExpenseDetailPageProps) {
  const { id } = await params;

  return <ExpenseDetailView expenseId={id} />;
}
