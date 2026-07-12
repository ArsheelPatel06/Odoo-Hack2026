import type { DomainEvent } from "@/core/events";
import type { TimelineEvent } from "@/shared/domain/types";

const EVENT_LABELS: Partial<Record<DomainEvent["type"], string>> = {
  TripCreated: "Trip Created",
  VehicleAssignedToTrip: "Vehicle Assigned",
  DriverAssignedToTrip: "Driver Assigned",
  TripDispatched: "Dispatched",
  FuelLogged: "Fuel Logged",
  TripCompleted: "Completed",
  TripCancelled: "Cancelled"
};

export function mapTripDomainEventToTimelineEvent(event: DomainEvent, index: number): TimelineEvent | null {
  const tripId = getTripIdFromEvent(event);

  if (!tripId) {
    return null;
  }

  return {
    id: `${event.type}_${index}_${event.timestamp}`,
    title: EVENT_LABELS[event.type] ?? event.type,
    description: describeTripEvent(event),
    timestamp: event.timestamp,
    entityId: tripId
  };
}

function getTripIdFromEvent(event: DomainEvent) {
  if ("tripId" in event) {
    return event.tripId;
  }

  return null;
}

function describeTripEvent(event: DomainEvent) {
  switch (event.type) {
    case "TripCreated":
      return `Trip ${event.tripNumber} created.`;
    case "VehicleAssignedToTrip":
      return `Vehicle ${event.vehicleId} assigned.`;
    case "DriverAssignedToTrip":
      return `Driver ${event.driverId} assigned.`;
    case "TripDispatched":
      return "Trip dispatched to route.";
    case "TripCompleted":
      return "Trip completed and resources released.";
    case "TripCancelled":
      return "Trip cancelled.";
    case "FuelLogged":
      return `Fuel log ${event.fuelLogId} recorded.`;
    default:
      return undefined;
  }
}

export function buildTripTimeline(events: DomainEvent[]) {
  return events
    .map((event, index) => mapTripDomainEventToTimelineEvent(event, index))
    .filter((event): event is TimelineEvent => event !== null)
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}
