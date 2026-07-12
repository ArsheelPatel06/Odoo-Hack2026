"use client";

import Link from "next/link";
import { useState } from "react";
import { expenseManagementService } from "@/modules/financial";
import { Button, Card, PageHeader } from "@/shared/components/ui";

type ExpenseDetailViewProps = {
  expenseId: string;
};

export function ExpenseDetailView({ expenseId }: ExpenseDetailViewProps) {
  const [detail] = useState(() => expenseManagementService.getExpenseDetail(expenseId));

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader title={detail.expense.expenseNumber} description="Expense detail and financial timeline." />
        <Button asChild variant="secondary">
          <Link href="/expenses">Back to expenses</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold">Expense Details</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Type" value={detail.expense.type} />
            <InfoRow label="Amount" value={`₹${detail.expense.amount.toLocaleString()}`} />
            <InfoRow label="Vehicle" value={detail.vehicle?.name ?? detail.expense.vehicleId ?? "—"} />
            <InfoRow label="Trip" value={detail.trip?.tripNumber ?? "—"} />
            <InfoRow label="Date" value={new Date(detail.expense.incurredAt).toLocaleString()} />
            <InfoRow label="Description" value={detail.expense.description ?? "—"} />
            <InfoRow label="Receipt" value={detail.expense.placeholders?.receipt ?? "Receipt placeholder"} />
          </dl>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Future Placeholders</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Invoice Upload" value={detail.expense.placeholders?.invoiceUpload ?? "—"} />
            <InfoRow label="Receipt OCR" value={detail.expense.placeholders?.receiptOcr ?? "—"} />
            <InfoRow label="Fuel Card" value={detail.expense.placeholders?.fuelCard ?? "—"} />
            <InfoRow label="Vendor" value={detail.expense.placeholders?.vendor ?? "—"} />
            <InfoRow label="Tax / GST" value={`${detail.expense.placeholders?.tax ?? "—"} / ${detail.expense.placeholders?.gst ?? "—"}`} />
          </dl>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold">Financial Timeline</h2>
        <ol className="mt-4 grid gap-3">
          {detail.timeline.map((event) => (
            <li key={event.id} className="rounded-md border border-border px-4 py-3">
              <div className="font-medium">{event.title}</div>
              {event.description ? <div className="mt-1 text-sm text-muted">{event.description}</div> : null}
              <div className="mt-2 text-xs text-muted">{new Date(event.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
