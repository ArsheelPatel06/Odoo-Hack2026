import { MockFuelLog } from "@/core/testing";
import type { FuelLog } from "@/shared/domain/models";

export const seedFuelLogs: FuelLog[] = [
  MockFuelLog({
    id: "fuel_001",
    fuelLogNumber: "FUEL-0001",
    vehicleId: "vehicle_001",
    tripId: "trip_003",
    fuelQuantity: 85,
    fuelCost: 7650,
    odometerReading: 15200,
    fuelStation: "HP Petrol Pump, Pune",
    notes: "Post-trip refuel after Nashik delivery"
  })
];
