import {
  calculateOperationalCost,
  calculateTripMargin,
  calculateTripProfit,
  calculateVehicleROI
} from "@/core/workflow";
import { EntityNotFoundError } from "@/core/errors";
import { ExpenseType, MaintenanceStatus, TripStatus } from "@/shared/domain/enums";
import type { FleetVehicleService } from "@/modules/fleet/services/fleet-vehicle-service";
import type {
  IExpenseRepository,
  IFuelRepository,
  IOperationalCostService
} from "@/modules/financial/repositories";
import type { TripCostSummary, VehicleCostSummary } from "@/modules/financial/types";
import type { IMaintenanceRepository } from "@/modules/maintenance/repositories";
import type { ITripRepository } from "@/modules/trips/repositories";

export class OperationalCostService implements IOperationalCostService {
  constructor(
    private readonly fuelRepository: IFuelRepository,
    private readonly expenseRepository: IExpenseRepository,
    private readonly maintenanceRepository: IMaintenanceRepository,
    private readonly tripRepository: ITripRepository,
    private readonly fleetVehicleService: FleetVehicleService
  ) {}

  getVehicleCostSummary(vehicleId: string): VehicleCostSummary {
    const vehicle = this.fleetVehicleService.findVehicleRecord(vehicleId);

    if (!vehicle) {
      throw new EntityNotFoundError("Vehicle", vehicleId);
    }

    const fuelCost = this.sumFuelCostByVehicle(vehicleId);
    const maintenanceCost = this.sumMaintenanceCostByVehicle(vehicleId);
    const otherExpenses = this.sumOtherExpensesByVehicle(vehicleId);
    const revenue = this.sumRevenueByVehicle(vehicleId);
    const totalCost = calculateOperationalCost(fuelCost, maintenanceCost, otherExpenses);
    const roi = calculateVehicleROI({
      revenue,
      fuelCost,
      maintenanceCost: maintenanceCost + otherExpenses,
      acquisitionCost: vehicle.acquisitionCost
    });

    return {
      vehicleId,
      fuelCost,
      maintenanceCost,
      otherExpenses,
      totalCost,
      revenue,
      roi
    };
  }

  getTripCostSummary(tripId: string): TripCostSummary {
    const trip = this.tripRepository.findById(tripId);

    if (!trip) {
      throw new EntityNotFoundError("Trip", tripId);
    }

    const fuelLogs = this.fuelRepository.findByTripId(tripId);
    const fuelUsed = fuelLogs.reduce((sum, log) => sum + log.fuelQuantity, 0);
    const fuelCost = fuelLogs.reduce((sum, log) => sum + log.fuelCost, 0);
    const otherExpenses = this.expenseRepository
      .findByTripId(tripId)
      .filter((expense) => expense.type !== ExpenseType.Fuel)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const revenue = trip.revenue ?? 0;
    const profit = calculateTripProfit({ revenue, fuelCost, otherExpenses });
    const margin = calculateTripMargin(profit, revenue);

    return {
      tripId,
      fuelUsed,
      fuelCost,
      otherExpenses,
      revenue,
      profit,
      margin
    };
  }

  private sumFuelCostByVehicle(vehicleId: string) {
    return this.fuelRepository.findByVehicleId(vehicleId).reduce((sum, log) => sum + log.fuelCost, 0);
  }

  private sumMaintenanceCostByVehicle(vehicleId: string) {
    return this.maintenanceRepository
      .findByVehicleId(vehicleId)
      .filter((record) => record.status === MaintenanceStatus.Completed)
      .reduce((sum, record) => sum + (record.actualCost ?? record.estimatedCost), 0);
  }

  private sumOtherExpensesByVehicle(vehicleId: string) {
    return this.expenseRepository
      .findByVehicleId(vehicleId)
      .filter((expense) => expense.type !== ExpenseType.Fuel)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }

  private sumRevenueByVehicle(vehicleId: string) {
    return this.tripRepository
      .findAll()
      .filter((trip) => trip.vehicleId === vehicleId && trip.status === TripStatus.Completed)
      .reduce((sum, trip) => sum + (trip.revenue ?? 0), 0);
  }
}
