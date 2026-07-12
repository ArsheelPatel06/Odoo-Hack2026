import type { Expense, FuelLog, Trip, Vehicle } from "@/shared/domain/models";
import type { TimelineEvent } from "@/shared/domain/types";

export type CreateFuelLogInput = {
  tripId: string;
  vehicleId: string;
  fuelQuantity: number;
  fuelCost: number;
  odometerReading: number;
  fuelStation: string;
  notes?: string;
  loggedAt?: string;
};

export type CreateExpenseInput = {
  type: Expense["type"];
  amount: number;
  description?: string;
  tripId?: string;
  vehicleId?: string;
  incurredAt?: string;
};

export type FuelLogDetail = {
  fuelLog: FuelLog;
  vehicle?: Vehicle;
  trip?: Trip;
  timeline: TimelineEvent[];
};

export type ExpenseDetail = {
  expense: Expense;
  vehicle?: Vehicle;
  trip?: Trip;
  timeline: TimelineEvent[];
};

export type VehicleCostSummary = {
  vehicleId: string;
  fuelCost: number;
  maintenanceCost: number;
  otherExpenses: number;
  totalCost: number;
  revenue: number;
  roi: number;
};

export type TripCostSummary = {
  tripId: string;
  fuelUsed: number;
  fuelCost: number;
  otherExpenses: number;
  revenue: number;
  profit: number;
  margin: number;
};
