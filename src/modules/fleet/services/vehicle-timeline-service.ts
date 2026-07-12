import type { DomainEvent } from "@/core/events";
import type { TimelineEvent } from "@/shared/domain/types";

const EVENT_LABELS: Partial<Record<DomainEvent["type"], string>> = {
  VehicleRegistered: "Vehicle Registered",
  TripDispatched: "Trip Assigned",
  TripCompleted: "Trip Completed",
  MaintenanceStarted: "Maintenance Started",
  MaintenanceCompleted: "Maintenance Completed",
  VehicleRetired: "Vehicle Retired",
  VehicleArchived: "Vehicle Archived",
  DriverRegistered: "Driver Registered",
  DriverSuspended: "Driver Suspended",
  DriverReactivated: "Driver Reactivated",
  DriverArchived: "Driver Archived",
  FuelLogged: "Fuel Logged",
  ExpenseCreated: "Expense Created"
};

export function mapDomainEventToTimelineEvent(event: DomainEvent, index: number): TimelineEvent {
  const vehicleId = "vehicleId" in event ? event.vehicleId : undefined;

  return {
    id: `${event.type}_${index}_${event.timestamp}`,
    title: EVENT_LABELS[event.type] ?? event.type,
    description: describeEvent(event),
    timestamp: event.timestamp,
    entityId: vehicleId
  };
}

function describeEvent(event: DomainEvent) {
  switch (event.type) {
    case "VehicleRegistered":
      return `Registered as ${event.registrationNumber}.`;
    case "TripDispatched":
      return `Trip ${event.tripId} dispatched.`;
    case "TripCompleted":
      return `Trip ${event.tripId} completed.`;
    case "MaintenanceStarted":
      return `Maintenance ${event.maintenanceId} started.`;
    case "MaintenanceCompleted":
      return `Maintenance ${event.maintenanceId} completed.`;
    case "VehicleRetired":
      return "Vehicle moved to retired status.";
    case "VehicleArchived":
      return "Vehicle archived from active registry.";
    case "FuelLogged":
      return `Fuel log ${event.fuelLogId} recorded.`;
    case "ExpenseCreated":
      return `Expense ${event.expenseId} recorded.`;
    default:
      return undefined;
  }
}

export function buildVehicleTimeline(events: DomainEvent[]) {
  return events
    .map((event, index) => mapDomainEventToTimelineEvent(event, index))
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}
