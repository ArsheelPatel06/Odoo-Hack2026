import type { DomainEvent } from "@/core/events";
import type { TimelineEvent } from "@/shared/domain/types";

const EVENT_LABELS: Partial<Record<DomainEvent["type"], string>> = {
  DriverRegistered: "Driver Created",
  TripDispatched: "Trip Assigned",
  TripCompleted: "Trip Completed",
  DriverSuspended: "Suspended",
  DriverReactivated: "Reactivated",
  DriverArchived: "Driver Archived",
  VehicleRegistered: "Vehicle Registered",
  VehicleRetired: "Vehicle Retired",
  VehicleArchived: "Vehicle Archived",
  MaintenanceStarted: "Maintenance Started",
  MaintenanceCompleted: "Maintenance Completed",
  FuelLogged: "Fuel Logged",
  ExpenseCreated: "Expense Created"
};

export function mapDriverDomainEventToTimelineEvent(event: DomainEvent, index: number): TimelineEvent | null {
  const driverId = getDriverIdFromEvent(event);

  if (!driverId) {
    return null;
  }

  return {
    id: `${event.type}_${index}_${event.timestamp}`,
    title: EVENT_LABELS[event.type] ?? event.type,
    description: describeDriverEvent(event),
    timestamp: event.timestamp,
    entityId: driverId
  };
}

function getDriverIdFromEvent(event: DomainEvent) {
  if ("driverId" in event) {
    return event.driverId;
  }

  return null;
}

function describeDriverEvent(event: DomainEvent) {
  switch (event.type) {
    case "DriverRegistered":
      return `Registered with license ${event.licenseNumber}.`;
    case "TripDispatched":
      return `Assigned to trip ${event.tripId}.`;
    case "TripCompleted":
      return `Completed trip ${event.tripId}.`;
    case "DriverSuspended":
      return "Driver suspended from active duty.";
    case "DriverReactivated":
      return "Driver reactivated and marked available.";
    case "DriverArchived":
      return "Driver archived from workforce registry.";
    default:
      return undefined;
  }
}

export function buildDriverTimeline(events: DomainEvent[]) {
  return events
    .map((event, index) => mapDriverDomainEventToTimelineEvent(event, index))
    .filter((event): event is TimelineEvent => event !== null)
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}
