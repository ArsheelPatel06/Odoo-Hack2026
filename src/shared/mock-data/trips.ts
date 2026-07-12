import { MockTrip } from "@/core/testing";
import { TripStatus } from "@/shared/domain/enums";
import type { Trip } from "@/shared/domain/models";

export const seedTrips: Trip[] = [
  MockTrip({
    id: "trip_001",
    tripNumber: "TRP-0001",
    status: TripStatus.Draft,
    origin: "Pune Depot",
    destination: "Mumbai Hub",
    cargoWeight: 900,
    plannedDistance: 148,
    vehicleId: "vehicle_001",
    driverId: "driver_001"
  }),
  MockTrip({
    id: "trip_002",
    tripNumber: "TRP-0002",
    status: TripStatus.Dispatched,
    origin: "Delhi Yard",
    destination: "Jaipur Terminal",
    cargoWeight: 1100,
    plannedDistance: 280,
    vehicleId: "vehicle_002",
    driverId: "driver_002"
  })
];
