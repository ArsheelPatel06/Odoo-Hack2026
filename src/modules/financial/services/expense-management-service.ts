import { EntityNotFoundError } from "@/core/errors";
import { OperationalCostUpdated, ROIUpdated, type DomainEvent } from "@/core/events";
import { createExpense as workflowCreateExpense } from "@/core/workflow";
import { CreateExpenseSchema } from "@/shared/domain/schemas/entity-schemas";
import type { Expense } from "@/shared/domain/models";
import type { FleetVehicleService } from "@/modules/fleet/services/fleet-vehicle-service";
import {
  DEFAULT_EXPENSE_LIST_QUERY,
  type ExpenseListQuery
} from "@/modules/financial/schemas";
import type {
  IExpenseManagementService,
  IExpenseRepository,
  IFinancialEventRepository
} from "@/modules/financial/repositories";
import { buildFinancialTimeline } from "@/modules/financial/services/financial-timeline-service";
import type { OperationalCostService } from "@/modules/financial/services/operational-cost-service";
import type { CreateExpenseInput, ExpenseDetail } from "@/modules/financial/types";
import type { ITripRepository } from "@/modules/trips/repositories";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `expense_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export class ExpenseManagementService implements IExpenseManagementService {
  constructor(
    private readonly repository: IExpenseRepository,
    private readonly eventRepository: IFinancialEventRepository,
    private readonly tripRepository: ITripRepository,
    private readonly fleetVehicleService: FleetVehicleService,
    private readonly operationalCostService: OperationalCostService
  ) {}

  createExpense(input: CreateExpenseInput) {
    const payload = CreateExpenseSchema.parse(input);
    const vehicle = payload.vehicleId
      ? this.fleetVehicleService.findVehicleRecord(payload.vehicleId)
      : null;
    const trip = payload.tripId ? this.tripRepository.findById(payload.tripId) : null;

    if (payload.tripId && !trip) {
      throw new EntityNotFoundError("Trip", payload.tripId);
    }

    const timestamp = payload.incurredAt ?? nowIso();
    const draft: Expense = {
      id: createId(),
      expenseNumber: this.repository.nextExpenseNumber(),
      type: payload.type,
      amount: payload.amount,
      description: payload.description,
      tripId: payload.tripId,
      vehicleId: payload.vehicleId ?? trip?.vehicleId,
      incurredAt: timestamp,
      placeholders: {
        receipt: "Receipt placeholder",
        invoiceUpload: "Invoice upload placeholder",
        receiptOcr: "Receipt OCR placeholder",
        fuelCard: "Fuel card placeholder",
        vendor: "Vendor placeholder",
        tax: "Tax placeholder",
        gst: "GST placeholder"
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const result = workflowCreateExpense({ expense: draft, vehicle, trip });

    if (!result.success) {
      throw result.error;
    }

    const created = this.repository.create(result.data.expense);
    this.appendEvent(created.id, result.data.event);

    if (created.vehicleId) {
      this.appendEvent(created.vehicleId, result.data.event);
      this.recordCostUpdates(created.vehicleId, created.tripId);
    }

    if (created.tripId) {
      this.appendEvent(created.tripId, result.data.event);
    }

    return created;
  }

  getExpenseById(id: string) {
    const expense = this.repository.findById(id);

    if (!expense) {
      throw new EntityNotFoundError("Expense", id);
    }

    return expense;
  }

  getExpenseDetail(id: string): ExpenseDetail {
    const expense = this.getExpenseById(id);
    const vehicle = expense.vehicleId
      ? this.fleetVehicleService.findVehicleRecord(expense.vehicleId) ?? undefined
      : undefined;
    const trip = expense.tripId ? this.tripRepository.findById(expense.tripId) ?? undefined : undefined;

    return {
      expense,
      vehicle,
      trip,
      timeline: buildFinancialTimeline(this.eventRepository.listByScopeId(id))
    };
  }

  listExpenses(query: ExpenseListQuery = DEFAULT_EXPENSE_LIST_QUERY) {
    const page = query.pagination?.page ?? DEFAULT_EXPENSE_LIST_QUERY.pagination?.page ?? 1;
    const pageSize = query.pagination?.pageSize ?? DEFAULT_EXPENSE_LIST_QUERY.pagination?.pageSize ?? 10;

    const mergedQuery: ExpenseListQuery = {
      ...DEFAULT_EXPENSE_LIST_QUERY,
      ...query,
      pagination: { page, pageSize }
    };

    const result = this.repository.query(mergedQuery);

    return {
      items: result.items,
      total: result.total,
      page,
      pageSize
    };
  }

  private recordCostUpdates(vehicleId: string, tripId?: string) {
    const summary = this.operationalCostService.getVehicleCostSummary(vehicleId);
    const timestamp = nowIso();

    const costEvent = OperationalCostUpdated.create({
      vehicleId,
      tripId,
      totalCost: summary.totalCost,
      timestamp
    });
    const roiEvent = ROIUpdated.create({
      vehicleId,
      roi: summary.roi,
      timestamp
    });

    this.appendEvent(vehicleId, costEvent);
    if (tripId) {
      this.appendEvent(tripId, costEvent);
    }
    this.appendEvent(vehicleId, roiEvent);
  }

  private appendEvent(scopeId: string, event: DomainEvent) {
    this.eventRepository.append(scopeId, event);
  }
}
