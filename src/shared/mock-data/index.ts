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
  InMemoryExpenseRepository,
  InMemoryFinancialEventRepository,
  InMemoryFuelRepository
} from "@/modules/financial/repositories";
import {
  ExpenseManagementService,
  FuelManagementService,
  OperationalCostService
} from "@/modules/financial/services";
import {
  DriverAssignedToTrip,
  DriverRegistered,
  ExpenseCreated,
  FuelLogged,
  MaintenanceCompleted,
  MaintenanceCreated,
  MaintenanceStarted,
  OperationalCostUpdated,
  RepairStarted,
  ROIUpdated,
  TripCompleted,
  TripCreated,
  TripDispatched,
  VehicleAssignedToTrip,
  VehicleRegistered,
  VehicleReturnedToFleet
} from "@/core/events";
import { MaintenanceStatus, TripStatus } from "@/shared/domain/enums";
import { generateSeedData } from "@/shared/mock-data/seeder";

const seedData = generateSeedData();
const seedFleetVehicles = seedData.vehicles;
const seedFleetDrivers = seedData.drivers;
const seedTrips = seedData.trips;
const seedFuelLogs = seedData.fuelLogs;
const seedExpenses = seedData.expenses;
const seedMaintenanceRecords = seedData.maintenanceLogs;

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

  if (trip.status === TripStatus.Completed && trip.vehicleId && trip.driverId) {
    tripEventRepository.append(
      trip.id,
      TripCompleted.create({
        tripId: trip.id,
        vehicleId: trip.vehicleId,
        driverId: trip.driverId,
        timestamp: trip.updatedAt
      })
    );
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

const fuelRepository = new InMemoryFuelRepository(seedFuelLogs);
const expenseRepository = new InMemoryExpenseRepository(seedExpenses);
const financialEventRepository = new InMemoryFinancialEventRepository();

export const operationalCostService = new OperationalCostService(
  fuelRepository,
  expenseRepository,
  maintenanceRepository,
  tripRepository,
  fleetVehicleService
);

export const fuelManagementService = new FuelManagementService(
  fuelRepository,
  financialEventRepository,
  tripRepository,
  fleetVehicleService,
  operationalCostService
);

export const expenseManagementService = new ExpenseManagementService(
  expenseRepository,
  financialEventRepository,
  tripRepository,
  fleetVehicleService,
  operationalCostService
);

for (const fuelLog of seedFuelLogs) {
  const logged = FuelLogged.create({
    fuelLogId: fuelLog.id,
    vehicleId: fuelLog.vehicleId,
    tripId: fuelLog.tripId,
    timestamp: fuelLog.loggedAt
  });
  financialEventRepository.append(fuelLog.id, logged);
  financialEventRepository.append(fuelLog.vehicleId, logged);
  financialEventRepository.append(fuelLog.tripId, logged);
}

for (const expense of seedExpenses) {
  const created = ExpenseCreated.create({
    expenseId: expense.id,
    vehicleId: expense.vehicleId,
    tripId: expense.tripId,
    timestamp: expense.incurredAt
  });
  financialEventRepository.append(expense.id, created);
  if (expense.vehicleId) {
    financialEventRepository.append(expense.vehicleId, created);
  }
  if (expense.tripId) {
    financialEventRepository.append(expense.tripId, created);
  }
}

for (const vehicleId of ["vehicle_001", "vehicle_002"]) {
  const summary = operationalCostService.getVehicleCostSummary(vehicleId);
  financialEventRepository.append(
    vehicleId,
    OperationalCostUpdated.create({
      vehicleId,
      totalCost: summary.totalCost,
      timestamp: new Date().toISOString()
    })
  );
  financialEventRepository.append(
    vehicleId,
    ROIUpdated.create({
      vehicleId,
      roi: summary.roi,
      timestamp: new Date().toISOString()
    })
  );
}

const tripCostSummary = operationalCostService.getTripCostSummary("trip_003");
financialEventRepository.append(
  "trip_003",
  TripCompleted.create({
    tripId: "trip_003",
    vehicleId: "vehicle_001",
    driverId: "driver_001",
    timestamp: seedTrips.find((trip) => trip.id === "trip_003")?.updatedAt ?? new Date().toISOString()
  })
);
financialEventRepository.append(
  "trip_003",
  OperationalCostUpdated.create({
    vehicleId: "vehicle_001",
    tripId: "trip_003",
    totalCost: tripCostSummary.fuelCost + tripCostSummary.otherExpenses,
    timestamp: new Date().toISOString()
  })
);

export const mockData = {
  dashboard: [],
  fleet: seedFleetVehicles,
  drivers: seedFleetDrivers,
  trips: seedTrips,
  maintenance: seedMaintenanceRecords,
  fuel: seedFuelLogs,
  expenses: seedExpenses,
  analytics: [],
  settings: []
} as const;
