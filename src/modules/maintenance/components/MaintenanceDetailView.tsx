"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { maintenanceManagementService } from "@/modules/maintenance";
import { MAINTENANCE_STATUS_COLORS, VEHICLE_STATUS_COLORS } from "@/shared/domain/constants";
import { MaintenanceStatus } from "@/shared/domain/enums";
import { Button, Card, Input, PageHeader, StatusBadge } from "@/shared/components/ui";

const toneMap = { success: "success", primary: "primary", warning: "warning", danger: "danger", muted: "muted" } as const;

type MaintenanceDetailViewProps = {
  maintenanceId: string;
};

export function MaintenanceDetailView({ maintenanceId }: MaintenanceDetailViewProps) {
  const [detail, setDetail] = useState(() => maintenanceManagementService.getMaintenanceDetail(maintenanceId));
  const [showComplete, setShowComplete] = useState(false);
  const [actualCost, setActualCost] = useState("");
  const [partsCost, setPartsCost] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");

  const refresh = () => setDetail(maintenanceManagementService.getMaintenanceDetail(maintenanceId));
  const maintenanceTone = toneMap[MAINTENANCE_STATUS_COLORS[detail.maintenance.status] as keyof typeof toneMap] ?? "muted";

  const handleComplete = () => {
    try {
      maintenanceManagementService.completeMaintenance(maintenanceId, {
        actualCost: Number(actualCost),
        partsCost: partsCost ? Number(partsCost) : undefined,
        laborCost: laborCost ? Number(laborCost) : undefined,
        serviceNotes
      });
      toast.success("Maintenance completed. Vehicle returned to fleet.");
      setShowComplete(false);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete maintenance.");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader title={detail.maintenance.maintenanceNumber} description={detail.maintenance.title} />
        <Button asChild variant="secondary"><Link href="/maintenance">Back to registry</Link></Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label={detail.maintenance.status} tone={maintenanceTone} />
          <span className="text-sm text-muted">Status changes only through the workflow engine.</span>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold">Overview</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Type" value={detail.maintenance.maintenanceType} />
            <InfoRow label="Priority" value={detail.maintenance.priority} />
            <InfoRow label="Technician" value={detail.maintenance.assignedTechnician} />
            <InfoRow label="Start Date" value={new Date(detail.maintenance.openedAt).toLocaleString()} />
            <InfoRow label="Expected Completion" value={new Date(detail.maintenance.expectedCompletionAt).toLocaleString()} />
          </dl>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Vehicle</h2>
          {detail.vehicle ? (
            <dl className="mt-4 grid gap-3 text-sm">
              <InfoRow label="Name" value={detail.vehicle.name} />
              <InfoRow label="Registration" value={detail.vehicle.registrationNumber} />
              <div>
                <StatusBadge
                  label={detail.vehicle.status}
                  tone={toneMap[VEHICLE_STATUS_COLORS[detail.vehicle.status] as keyof typeof toneMap] ?? "muted"}
                />
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted">Vehicle not found.</p>
          )}
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Cost</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Estimated Cost" value={`₹${detail.cost.estimatedCost.toLocaleString()}`} />
            <InfoRow label="Actual Cost" value={detail.cost.actualCost ? `₹${detail.cost.actualCost.toLocaleString()}` : "Pending"} />
            <InfoRow label="Parts Cost" value={detail.cost.partsCost ? `₹${detail.cost.partsCost.toLocaleString()}` : "Placeholder"} />
            <InfoRow label="Labor Cost" value={detail.cost.laborCost ? `₹${detail.cost.laborCost.toLocaleString()}` : "Placeholder"} />
          </dl>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Service Notes</h2>
          <p className="mt-4 text-sm text-muted">{detail.serviceNotes}</p>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Service Vendor" value={detail.overview.placeholders.serviceVendor} />
            <InfoRow label="Warranty" value={detail.overview.placeholders.warranty} />
            <InfoRow label="Documents" value="Documents placeholder" />
          </dl>
        </Card>
      </div>

      {detail.maintenance.status === MaintenanceStatus.Active ? (
        <Card>
          <Button onClick={() => setShowComplete(true)}>Complete Maintenance</Button>
        </Card>
      ) : null}

      {showComplete ? (
        <Card className="grid max-w-2xl gap-4">
          <h2 className="text-base font-semibold">Complete Maintenance</h2>
          <Input value={actualCost} onChange={(e) => setActualCost(e.target.value)} placeholder="Actual cost" />
          <Input value={partsCost} onChange={(e) => setPartsCost(e.target.value)} placeholder="Parts cost" />
          <Input value={laborCost} onChange={(e) => setLaborCost(e.target.value)} placeholder="Labor cost" />
          <Input value={serviceNotes} onChange={(e) => setServiceNotes(e.target.value)} placeholder="Service notes" />
          <div className="flex gap-2">
            <Button onClick={handleComplete}>Confirm completion</Button>
            <Button variant="secondary" onClick={() => setShowComplete(false)}>Close</Button>
          </div>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-base font-semibold">Timeline</h2>
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
