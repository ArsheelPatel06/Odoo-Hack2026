import type { DomainEvent } from "@/core/events";
import type { Expense, FuelLog } from "@/shared/domain/models";
import type { ExpenseListQuery, FuelListQuery } from "@/modules/financial/schemas";
import type {
  CreateExpenseInput,
  CreateFuelLogInput,
  ExpenseDetail,
  FuelLogDetail,
  TripCostSummary,
  VehicleCostSummary
} from "@/modules/financial/types";

export interface IFuelRepository {
  findAll(): FuelLog[];
  findById(id: string): FuelLog | null;
  findByVehicleId(vehicleId: string): FuelLog[];
  findByTripId(tripId: string): FuelLog[];
  create(fuelLog: FuelLog): FuelLog;
  query(query: FuelListQuery): { items: FuelLog[]; total: number };
  nextFuelLogNumber(): string;
}

export interface IExpenseRepository {
  findAll(): Expense[];
  findById(id: string): Expense | null;
  findByVehicleId(vehicleId: string): Expense[];
  findByTripId(tripId: string): Expense[];
  create(expense: Expense): Expense;
  query(query: ExpenseListQuery): { items: Expense[]; total: number };
  nextExpenseNumber(): string;
}

export interface IFinancialEventRepository {
  append(scopeId: string, event: DomainEvent): void;
  listByScopeId(scopeId: string): DomainEvent[];
  listAll(): DomainEvent[];
}

export interface IFuelManagementService {
  createFuelLog(input: CreateFuelLogInput): FuelLog;
  getFuelLogById(id: string): FuelLog;
  getFuelLogDetail(id: string): FuelLogDetail;
  listFuelLogs(query?: FuelListQuery): { items: FuelLog[]; total: number; page: number; pageSize: number };
}

export interface IExpenseManagementService {
  createExpense(input: CreateExpenseInput): Expense;
  getExpenseById(id: string): Expense;
  getExpenseDetail(id: string): ExpenseDetail;
  listExpenses(query?: ExpenseListQuery): { items: Expense[]; total: number; page: number; pageSize: number };
}

export interface IOperationalCostService {
  getVehicleCostSummary(vehicleId: string): VehicleCostSummary;
  getTripCostSummary(tripId: string): TripCostSummary;
}
