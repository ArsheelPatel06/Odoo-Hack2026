import type { DomainEvent } from "@/core/events";
import type { TimelineEvent } from "@/shared/domain/types";

const EVENT_LABELS: Partial<Record<DomainEvent["type"], string>> = {
  MaintenanceCreated: "Maintenance Created",
  MaintenanceStarted: "Vehicle Sent To Workshop",
  RepairStarted: "Repair Started",
  MaintenanceCompleted: "Repair Completed",
  VehicleReturnedToFleet: "Vehicle Returned To Fleet"
};

export function mapMaintenanceDomainEventToTimelineEvent(event: DomainEvent, index: number): TimelineEvent | null {
  const maintenanceId = getMaintenanceIdFromEvent(event);

  if (!maintenanceId) {
    return null;
  }

  return {
    id: `${event.type}_${index}_${event.timestamp}`,
    title: EVENT_LABELS[event.type] ?? event.type,
    description: describeMaintenanceEvent(event),
    timestamp: event.timestamp,
    entityId: maintenanceId
  };
}

function getMaintenanceIdFromEvent(event: DomainEvent) {
  if ("maintenanceId" in event) {
    return event.maintenanceId;
  }

  return null;
}

function describeMaintenanceEvent(event: DomainEvent) {
  switch (event.type) {
    case "MaintenanceCreated":
      return `Maintenance ${event.maintenanceNumber} created.`;
    case "MaintenanceStarted":
      return "Vehicle moved to workshop via workflow engine.";
    case "RepairStarted":
      return "Technician started repair work.";
    case "MaintenanceCompleted":
      return "Repair work completed.";
    case "VehicleReturnedToFleet":
      return "Vehicle returned to available fleet.";
    default:
      return undefined;
  }
}

export function buildMaintenanceTimeline(events: DomainEvent[]) {
  return events
    .map((event, index) => mapMaintenanceDomainEventToTimelineEvent(event, index))
    .filter((event): event is TimelineEvent => event !== null)
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}
