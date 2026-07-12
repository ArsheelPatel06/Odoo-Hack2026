"use client";

import { useMemo } from "react";
import { operationalCostService } from "@/modules/financial";
import { Card } from "@/shared/components/ui";

type TripCostSummaryCardProps = {
  tripId: string;
};

export function TripCostSummaryCard({ tripId }: TripCostSummaryCardProps) {
  const summary = useMemo(() => {
    try {
      return operationalCostService.getTripCostSummary(tripId);
    } catch {
      return null;
    }
  }, [tripId]);

  if (!summary) {
    return (
      <Card>
        <h2 className="text-base font-semibold">Trip Cost Summary</h2>
        <p className="mt-2 text-sm text-muted">Cost summary available after trip completion.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-base font-semibold">Trip Cost Summary</h2>
      <p className="mt-1 text-sm text-muted">Automatically calculated from fuel logs and expenses.</p>
      <dl className="mt-4 grid gap-3 text-sm">
        <InfoRow label="Fuel Used" value={`${summary.fuelUsed} L`} />
        <InfoRow label="Fuel Cost" value={`₹${summary.fuelCost.toLocaleString()}`} />
        <InfoRow label="Other Expenses" value={`₹${summary.otherExpenses.toLocaleString()}`} />
        <InfoRow label="Revenue" value={`₹${summary.revenue.toLocaleString()}`} />
        <InfoRow label="Profit" value={`₹${summary.profit.toLocaleString()}`} />
        <InfoRow label="Margin" value={`${(summary.margin * 100).toFixed(1)}%`} />
      </dl>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
