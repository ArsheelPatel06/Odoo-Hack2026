"use client";

import { useMemo } from "react";
import { operationalCostService } from "@/modules/financial";
import { Card } from "@/shared/components/ui";

type VehicleCostSummaryCardProps = {
  vehicleId: string;
};

export function VehicleCostSummaryCard({ vehicleId }: VehicleCostSummaryCardProps) {
  const summary = useMemo(() => operationalCostService.getVehicleCostSummary(vehicleId), [vehicleId]);

  return (
    <Card>
      <h2 className="text-base font-semibold">Vehicle Cost Summary</h2>
      <p className="mt-1 text-sm text-muted">Read-only operational cost aggregation.</p>
      <dl className="mt-4 grid gap-3 text-sm">
        <InfoRow label="Fuel Cost" value={`₹${summary.fuelCost.toLocaleString()}`} />
        <InfoRow label="Maintenance Cost" value={`₹${summary.maintenanceCost.toLocaleString()}`} />
        <InfoRow label="Other Expenses" value={`₹${summary.otherExpenses.toLocaleString()}`} />
        <InfoRow label="Total Cost" value={`₹${summary.totalCost.toLocaleString()}`} />
        <InfoRow label="Revenue" value={`₹${summary.revenue.toLocaleString()}`} />
        <InfoRow label="ROI" value={`${(summary.roi * 100).toFixed(1)}%`} />
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
