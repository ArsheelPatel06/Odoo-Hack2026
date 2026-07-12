import { DriverValidator, ExpenseValidator, FuelValidator, MaintenanceValidator, TripValidator, VehicleValidator } from "@/core/validators";
import {
  assignDriver,
  assignVehicle,
  cancelTrip,
  closeMaintenance,
  completeTrip,
  dispatchTrip,
  startMaintenance
} from "@/core/workflow";
import {
  calculateFleetUtilizationPlaceholder,
  calculateFuelEfficiency,
  calculateOperationalCost,
  calculateVehicleROI
} from "@/core/calculations";
import type {
  IAnalyticsService,
  IDriverService,
  IExpenseService,
  IFuelService,
  IMaintenanceService,
  ITripService,
  IVehicleService
} from "@/core/services/interfaces";

export class VehicleService implements IVehicleService {
  validateRegistrationUnique: IVehicleService["validateRegistrationUnique"] = (registrationNumber, vehicles, excludeId) =>
    VehicleValidator.validateRegistrationUnique(registrationNumber, vehicles, excludeId);

  validateAvailable: IVehicleService["validateAvailable"] = (vehicle) => VehicleValidator.validateAvailable(vehicle);

  validateForDispatch: IVehicleService["validateForDispatch"] = (vehicle) => VehicleValidator.validateForDispatch(vehicle);
}

export class DriverService implements IDriverService {
  validateAvailable: IDriverService["validateAvailable"] = (driver) => DriverValidator.validateAvailable(driver);

  validateLicense: IDriverService["validateLicense"] = (driver, referenceDate) =>
    DriverValidator.validateLicense(driver, referenceDate);

  validateForAssignment: IDriverService["validateForAssignment"] = (driver, referenceDate) =>
    DriverValidator.validateForAssignment(driver, referenceDate);
}

export class TripService implements ITripService {
  validateDispatch: ITripService["validateDispatch"] = (input) => TripValidator.validateDispatch(input);

  assignVehicle: ITripService["assignVehicle"] = (input) => assignVehicle(input);

  assignDriver: ITripService["assignDriver"] = (input) => assignDriver(input);

  dispatchTrip: ITripService["dispatchTrip"] = (input) => dispatchTrip(input);

  completeTrip: ITripService["completeTrip"] = (input) => completeTrip(input);

  cancelTrip: ITripService["cancelTrip"] = (input) => cancelTrip(input);
}

export class MaintenanceService implements IMaintenanceService {
  validateStart: IMaintenanceService["validateStart"] = (input) => MaintenanceValidator.validateStart(input);

  validateClose: IMaintenanceService["validateClose"] = (maintenance) => MaintenanceValidator.validateClose(maintenance);

  startMaintenance: IMaintenanceService["startMaintenance"] = (input) => startMaintenance(input);

  closeMaintenance: IMaintenanceService["closeMaintenance"] = (input) => closeMaintenance(input);
}

export class FuelService implements IFuelService {
  validate: IFuelService["validate"] = (input) => FuelValidator.validate(input);
}

export class ExpenseService implements IExpenseService {
  validate: IExpenseService["validate"] = (input) => ExpenseValidator.validate(input);
}

export class AnalyticsService implements IAnalyticsService {
  calculateFuelEfficiency: IAnalyticsService["calculateFuelEfficiency"] = (distance, fuelQuantity) =>
    calculateFuelEfficiency(distance, fuelQuantity);

  calculateOperationalCost: IAnalyticsService["calculateOperationalCost"] = (fuelCost, maintenanceCost) =>
    calculateOperationalCost(fuelCost, maintenanceCost);

  calculateVehicleROI: IAnalyticsService["calculateVehicleROI"] = (input) => calculateVehicleROI(input);

  calculateFleetUtilization: IAnalyticsService["calculateFleetUtilization"] = (input) =>
    calculateFleetUtilizationPlaceholder(input);
}

export const vehicleService = new VehicleService();
export const driverService = new DriverService();
export const tripService = new TripService();
export const maintenanceService = new MaintenanceService();
export const fuelService = new FuelService();
export const expenseService = new ExpenseService();
export const analyticsService = new AnalyticsService();
