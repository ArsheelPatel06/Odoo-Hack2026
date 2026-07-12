"use client";

import Link from "next/link";
import { useState } from "react";
import { fuelManagementService } from "@/modules/financial";
import { Button, Card, PageHeader } from "@/shared/components/ui";

type FuelDetailViewProps = {
  fuelLogId: string;
};

export function FuelDetailView({ fuelLogId }: FuelDetailViewProps) {
  const [detail] = useState(() => fuelManagementService.getFuelLogDetail(fuelLogId));

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader title={detail.fuelLog.fuelLogNumber} description="Fuel log detail and financial timeline." />
        <Button asChild variant="secondary">
          <Link href="/fuel">Back to fuel logs</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold">Fuel Details</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Trip" value={detail.trip?.tripNumber ?? detail.fuelLog.tripId} />
            <InfoRow label="Vehicle" value={detail.vehicle?.name ?? detail.fuelLog.vehicleId} />
            <InfoRow label="Date" value={new Date(detail.fuelLog.loggedAt).toLocaleString()} />
            <InfoRow label="Odometer" value={`${detail.fuelLog.odometerReading.toLocaleString()} km`} />
            <InfoRow label="Quantity" value={`${detail.fuelLog.fuelQuantity} L`} />
            <InfoRow label="Cost" value={`₹${detail.fuelLog.fuelCost.toLocaleString()}`} />
            <InfoRow label="Station" value={detail.fuelLog.fuelStation} />
            <InfoRow label="Notes" value={detail.fuelLog.notes ?? "—"} />
          </dl>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Future Placeholders</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Invoice Upload" value={detail.fuelLog.placeholders?.invoiceUpload ?? "—"} />
            <InfoRow label="Receipt OCR" value={detail.fuelLog.placeholders?.receiptOcr ?? "—"} />
            <InfoRow label="Fuel Card" value={detail.fuelLog.placeholders?.fuelCard ?? "—"} />
            <InfoRow label="Vendor" value={detail.fuelLog.placeholders?.vendor ?? "—"} />
            <InfoRow label="Tax / GST" value={`${detail.fuelLog.placeholders?.tax ?? "—"} / ${detail.fuelLog.placeholders?.gst ?? "—"}`} />
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
