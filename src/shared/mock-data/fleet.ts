import { MockVehicle } from "@/core/testing";
import { VehicleStatus, VehicleType } from "@/shared/domain/enums";
import type { Vehicle } from "@/shared/domain/models";

export const seedFleetVehicles: Vehicle[] = [
  MockVehicle({
    id: "vehicle_001",
    registrationNumber: "MH-12-AB-1234",
    name: "Transit Truck Alpha",
    type: VehicleType.Truck,
    status: VehicleStatus.Available,
    capacity: 5000,
    odometerReading: 48210,
    acquisitionCost: 850000
  }),
  MockVehicle({
    id: "vehicle_002",
    registrationNumber: "DL-01-CD-5678",
    name: "Metro Van Bravo",
    type: VehicleType.Van,
    status: VehicleStatus.OnTrip,
    capacity: 1200,
    odometerReading: 31840,
    acquisitionCost: 620000
  }),
  MockVehicle({
    id: "vehicle_003",
    registrationNumber: "KA-05-EF-9012",
    name: "Cargo Trailer Charlie",
    type: VehicleType.Trailer,
    status: VehicleStatus.InShop,
    capacity: 8000,
    odometerReading: 90500,
    acquisitionCost: 430000
  }),
  MockVehicle({
    id: "vehicle_004",
    registrationNumber: "GJ-11-GH-3456",
    name: "Mini Truck Delta",
    type: VehicleType.MiniTruck,
    status: VehicleStatus.Available,
    capacity: 1800,
    odometerReading: 22110,
    acquisitionCost: 510000
  }),
  MockVehicle({
    id: "vehicle_005",
    registrationNumber: "TN-22-IJ-7890",
    name: "Legacy Truck Echo",
    type: VehicleType.Truck,
    status: VehicleStatus.Retired,
    capacity: 4200,
    odometerReading: 210400,
    acquisitionCost: 390000
  })
];
