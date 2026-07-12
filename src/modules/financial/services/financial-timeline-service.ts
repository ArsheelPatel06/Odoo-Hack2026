import type { DomainEvent } from "@/core/events";
import type { TimelineEvent } from "@/shared/domain/types";

const EVENT_LABELS: Partial<Record<DomainEvent["type"], string>> = {
  TripCompleted: "Trip Completed",
  FuelLogged: "Fuel Logged",
  ExpenseCreated: "Expense Added",
  OperationalCostUpdated: "Operational Cost Updated",
  ROIUpdated: "ROI Updated"
};

export function mapFinancialDomainEventToTimelineEvent(event: DomainEvent, index: number): TimelineEvent | null {
  const entityId = getEntityIdFromEvent(event);

  if (!entityId) {
    return null;
  }

  return {
    id: `${event.type}_${index}_${event.timestamp}`,
    title: EVENT_LABELS[event.type] ?? event.type,
    description: describeFinancialEvent(event),
    timestamp: event.timestamp,
    entityId
  };
}

function getEntityIdFromEvent(event: DomainEvent) {
  if ("fuelLogId" in event) {
    return event.fuelLogId;
  }

  if ("expenseId" in event) {
    return event.expenseId;
  }

  if ("tripId" in event) {
    return event.tripId;
  }

  if ("vehicleId" in event) {
    return event.vehicleId;
  }

  return null;
}

function describeFinancialEvent(event: DomainEvent) {
  switch (event.type) {
    case "TripCompleted":
      return `Trip ${event.tripId} completed.`;
    case "FuelLogged":
      return `Fuel logged for vehicle ${event.vehicleId}.`;
    case "ExpenseCreated":
      return `Expense ${event.expenseId} recorded.`;
    case "OperationalCostUpdated":
      return `Operational cost updated to ₹${event.totalCost.toLocaleString()}.`;
    case "ROIUpdated":
      return `Vehicle ROI updated to ${(event.roi * 100).toFixed(1)}%.`;
    default:
      return undefined;
  }
}

export function buildFinancialTimeline(events: DomainEvent[]) {
  return events
    .map((event, index) => mapFinancialDomainEventToTimelineEvent(event, index))
    .filter((event): event is TimelineEvent => event !== null)
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}
