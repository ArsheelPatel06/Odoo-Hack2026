"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { buildDriverComplianceIndicators } from "@/modules/drivers/services/driver-compliance";
import { tripManagementService } from "@/modules/trips";
import {
  TripCompletionDrawer,
  TripLifecycleRail,
  TripLivePanel
} from "@/modules/trips/components/dispatch";
import { TripCostSummaryCard } from "@/modules/financial/components";
import { TripStatus } from "@/shared/domain/enums";
import {
  Badge,
  Button,
  Card,
  ConfirmationDialog,
  InformationCard,
  PageHeader,
  Tabs,
  Timeline,
  EmailSenderModal
} from "@/shared/components/ui";
import { getTripInvoiceTemplate } from "@/shared/lib/email-templates";

type TripDetailViewProps = {
  tripId: string;
};

export function TripDetailView({ tripId }: TripDetailViewProps) {
  const [detail, setDetail] = useState(() => tripManagementService.getTripDetail(tripId));
  const [completionOpen, setCompletionOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [finalOdometer, setFinalOdometer] = useState("");
  const [fuelConsumed, setFuelConsumed] = useState("");
  const [revenue, setRevenue] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");

  const refresh = () => setDetail(tripManagementService.getTripDetail(tripId));

  const handleComplete = async () => {
    setCompleting(true);
    try {
      tripManagementService.completeTrip(tripId, {
        finalOdometer: Number(finalOdometer),
        fuelConsumed: Number(fuelConsumed),
        revenue: Number(revenue),
        completionNotes
      });
      toast.success("Trip completed. Vehicle and driver released to Available.");
      setCompletionOpen(false);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete trip.");
    } finally {
      setCompleting(false);
    }
  };

  const handleCancel = () => {
    try {
      tripManagementService.cancelTrip(tripId);
      toast.success("Trip cancelled. Resources restored when applicable.");
      setCancelOpen(false);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to cancel trip.");
    }
  };

  const timelineItems = detail.timeline.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    timestamp: new Date(event.timestamp).toLocaleString()
  }));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title={detail.trip.tripNumber} description={detail.overview.route} />
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/trips">Trip registry</Link>
          </Button>
          {detail.trip.status === TripStatus.Dispatched ? (
            <>
              <Button onClick={() => setCompletionOpen(true)}>Complete trip</Button>
              <Button variant="danger" onClick={() => setCancelOpen(true)}>
                Cancel trip
              </Button>
            </>
          ) : detail.trip.status === TripStatus.Completed ? (
            <Button onClick={() => setIsEmailModalOpen(true)}>Share Invoice (Email)</Button>
          ) : null}
        </div>
      </div>

      <TripLifecycleRail status={detail.trip.status} />

      <TripLivePanel detail={detail} />

      <Tabs
        defaultTabId="overview"
        items={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="grid gap-4 lg:grid-cols-3">
                <InformationCard title="Route">
                  <dl className="grid gap-2 text-body-sm">
                    <Row label="Source" value={detail.trip.origin} />
                    <Row label="Destination" value={detail.trip.destination} />
                    <Row label="Cargo" value={`${detail.trip.cargoWeight.toLocaleString()} kg`} />
                    <Row label="Distance" value={`${detail.trip.plannedDistance.toLocaleString()} km`} />
                  </dl>
                </InformationCard>

                <InformationCard title="Vehicle">
                  {detail.vehicle ? (
                    <dl className="grid gap-2 text-body-sm">
                      <Row label="Name" value={detail.vehicle.name} />
                      <Row label="Registration" value={detail.vehicle.registrationNumber} />
                      <Row label="Capacity" value={`${detail.vehicle.capacity.toLocaleString()} kg`} />
                    </dl>
                  ) : (
                    <p className="text-body-sm text-muted">No vehicle assigned.</p>
                  )}
                </InformationCard>

                <InformationCard title="Driver">
                  {detail.driver ? (
                    <>
                      <dl className="grid gap-2 text-body-sm">
                        <Row label="Name" value={detail.driver.name} />
                        <Row label="Safety" value={`★ ${detail.driver.safetyScore}`} />
                        <Row label="License" value={detail.driver.licenseNumber} />
                      </dl>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {buildDriverComplianceIndicators(detail.driver)
                          .filter((item) => item.active)
                          .map((item) => (
                            <Badge key={item.key} tone={item.tone}>
                              {item.label}
                            </Badge>
                          ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-body-sm text-muted">No driver assigned.</p>
                  )}
                </InformationCard>
              </div>
            )
          },
          {
            id: "timeline",
            label: "History",
            content: (
              <Card className="space-y-4">
                <h3 className="text-heading-sm font-semibold text-primary">Operational timeline</h3>
                <Timeline items={timelineItems} />
              </Card>
            )
          },
          {
            id: "financial",
            label: "Financial",
            content: (
              <div className="grid gap-4 md:grid-cols-2">
                {detail.trip.status === TripStatus.Completed ? (
                  <TripCostSummaryCard tripId={detail.trip.id} />
                ) : (
                  <Card>
                    <p className="text-body-sm text-muted">Trip cost summary unlocks after completion.</p>
                  </Card>
                )}
                <Card>
                  <h3 className="text-heading-sm font-semibold text-primary">Financial timeline</h3>
                  <p className="mt-2 text-body-sm text-muted">
                    Fuel logs, expenses, and operational cost updates appear after trip completion.
                  </p>
                </Card>
              </div>
            )
          }
        ]}
      />

      <TripCompletionDrawer
        open={completionOpen}
        onOpenChange={setCompletionOpen}
        finalOdometer={finalOdometer}
        fuelConsumed={fuelConsumed}
        revenue={revenue}
        completionNotes={completionNotes}
        onFinalOdometerChange={setFinalOdometer}
        onFuelConsumedChange={setFuelConsumed}
        onRevenueChange={setRevenue}
        onCompletionNotesChange={setCompletionNotes}
        onSubmit={handleComplete}
        loading={completing}
      />

      <ConfirmationDialog
        open={cancelOpen}
        title="Cancel dispatched trip?"
        description="This restores vehicle and driver to Available when the trip is in transit."
        tone="danger"
        confirmLabel="Cancel trip"
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />

      <EmailSenderModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        subject={`Invoice for Trip ${detail.trip.tripNumber}`}
        htmlContent={getTripInvoiceTemplate(
          detail.trip.tripNumber,
          detail.trip.origin,
          detail.trip.destination,
          detail.driver?.name || "Unassigned", 
          detail.vehicle?.registrationNumber || "Unassigned",
          detail.trip.revenue || 0,
          0 // We can pass 0 for expenses for now, as it's just an invoice
        )}
        title="Send Invoice"
        description="Email this trip's invoice directly to the customer or driver."
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-primary">{value}</dd>
    </div>
  );
}
