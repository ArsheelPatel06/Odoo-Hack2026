import {
  InMemoryDriverEventRepository,
  InMemoryDriverRepository
} from "@/modules/drivers/repositories";
import { FleetDriverService } from "@/modules/drivers/services/fleet-driver-service";
import {
  InMemoryTripEventRepository,
  InMemoryTripRepository
} from "@/modules/trips/repositories";
import { TripManagementService } from "@/modules/trips/services/trip-management-service";
import {
  InMemoryVehicleEventRepository,
  InMemoryVehicleRepository
} from "@/modules/fleet/repositories";
import { FleetVehicleService } from "@/modules/fleet/services/fleet-vehicle-service";
import {
  InMemoryMaintenanceEventRepository,
  InMemoryMaintenanceRepository
} from "@/modules/maintenance/repositories";
import { MaintenanceManagementService } from "@/modules/maintenance/services/maintenance-management-service";
import {
  DriverAssignedToTrip,
  DriverRegistered,
  MaintenanceCompleted,
  MaintenanceCreated,
  MaintenanceStarted,
  RepairStarted,
  TripCreated,
  TripDispatched,
  VehicleAssignedToTrip,
  VehicleRegistered,
  VehicleReturnedToFleet
} from "@/core/events";
import { MaintenanceStatus, TripStatus } from "@/shared/domain/enums";
import { seedFleetDrivers } from "@/shared/mock-data/drivers";
import { seedFleetVehicles } from "@/shared/mock-data/fleet";
import { seedMaintenanceRecords } from "@/shared/mock-data/maintenance";
import { seedTrips } from "@/shared/mock-data/trips";

const vehicleRepository = new InMemoryVehicleRepository(seedFleetVehicles);
const vehicleEventRepository = new InMemoryVehicleEventRepository();

for (const vehicle of seedFleetVehicles) {
  vehicleEventRepository.append(
    vehicle.id,
    VehicleRegistered.create({
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      timestamp: vehicle.createdAt
    })
  );
}

export const fleetVehicleService = new FleetVehicleService(vehicleRepository, vehicleEventRepository);

const driverRepository = new InMemoryDriverRepository(seedFleetDrivers);
const driverEventRepository = new InMemoryDriverEventRepository();

for (const driver of seedFleetDrivers) {
  driverEventRepository.append(
    driver.id,
    DriverRegistered.create({
      driverId: driver.id,
      licenseNumber: driver.licenseNumber,
      timestamp: driver.createdAt
    })
  );
}

export const fleetDriverService = new FleetDriverService(driverRepository, driverEventRepository);

const tripRepository = new InMemoryTripRepository(seedTrips);
const tripEventRepository = new InMemoryTripEventRepository();

for (const trip of seedTrips) {
  tripEventRepository.append(
    trip.id,
    TripCreated.create({
      tripId: trip.id,
      tripNumber: trip.tripNumber,
      timestamp: trip.createdAt
    })
  );

  if (trip.vehicleId) {
    tripEventRepository.append(
      trip.id,
      VehicleAssignedToTrip.create({
        tripId: trip.id,
        vehicleId: trip.vehicleId,
        timestamp: trip.createdAt
      })
    );
  }

  if (trip.driverId) {
    tripEventRepository.append(
      trip.id,
      DriverAssignedToTrip.create({
        tripId: trip.id,
        driverId: trip.driverId,
        timestamp: trip.createdAt
      })
    );
  }

  if (trip.status === TripStatus.Dispatched && trip.vehicleId && trip.driverId) {
    const dispatchedEvent = TripDispatched.create({
      tripId: trip.id,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      timestamp: trip.updatedAt
    });
    tripEventRepository.append(trip.id, dispatchedEvent);
    fleetVehicleService.recordWorkflowEvent(dispatchedEvent);
    fleetDriverService.recordWorkflowEvent(dispatchedEvent);
  }
}

export const tripManagementService = new TripManagementService(
  tripRepository,
  tripEventRepository,
  fleetVehicleService,
  fleetDriverService
);

const maintenanceRepository = new InMemoryMaintenanceRepository(seedMaintenanceRecords);
const maintenanceEventRepository = new InMemoryMaintenanceEventRepository();

for (const record of seedMaintenanceRecords) {
  maintenanceEventRepository.append(
    record.id,
    MaintenanceCreated.create({
      maintenanceId: record.id,
      vehicleId: record.vehicleId,
      maintenanceNumber: record.maintenanceNumber,
      timestamp: record.createdAt
    })
  );

  if (record.status === MaintenanceStatus.Active) {
    const started = MaintenanceStarted.create({
      maintenanceId: record.id,
      vehicleId: record.vehicleId,
      timestamp: record.openedAt
    });
    maintenanceEventRepository.append(record.id, started);
    maintenanceEventRepository.append(
      record.id,
      RepairStarted.create({
        maintenanceId: record.id,
        vehicleId: record.vehicleId,
        timestamp: record.openedAt
      })
    );
    fleetVehicleService.recordWorkflowEvent(started);
  }

  if (record.status === MaintenanceStatus.Completed && record.completedAt) {
    const completed = MaintenanceCompleted.create({
      maintenanceId: record.id,
      vehicleId: record.vehicleId,
      timestamp: record.completedAt
    });
    maintenanceEventRepository.append(record.id, completed);
    maintenanceEventRepository.append(
      record.id,
      VehicleReturnedToFleet.create({
        maintenanceId: record.id,
        vehicleId: record.vehicleId,
        timestamp: record.completedAt
      })
    );
  }
}

export const maintenanceManagementService = new MaintenanceManagementService(
  maintenanceRepository,
  maintenanceEventRepository,
  fleetVehicleService
);

export const mockData = {
  dashboard: [],
  fleet: seedFleetVehicles,
  drivers: seedFleetDrivers,
  trips: seedTrips,
  maintenance: seedMaintenanceRecords,
  fuel: [],
  expenses: [],
  analytics: [],
  settings: []
} as const;
