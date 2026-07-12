import { EntityNotFoundError } from "@/core/errors";
import { OperationalCostUpdated, ROIUpdated, type DomainEvent } from "@/core/events";
import { logFuel as workflowLogFuel } from "@/core/workflow";
import { CreateFuelLogSchema } from "@/shared/domain/schemas/entity-schemas";
import type { FuelLog } from "@/shared/domain/models";
import type { FleetVehicleService } from "@/modules/fleet/services/fleet-vehicle-service";
import {
  DEFAULT_FUEL_LIST_QUERY,
  type FuelListQuery
} from "@/modules/financial/schemas";
import type {
  IFinancialEventRepository,
  IFuelManagementService,
  IFuelRepository
} from "@/modules/financial/repositories";
import { buildFinancialTimeline } from "@/modules/financial/services/financial-timeline-service";
import type { OperationalCostService } from "@/modules/financial/services/operational-cost-service";
import type { CreateFuelLogInput, FuelLogDetail } from "@/modules/financial/types";
import type { ITripRepository } from "@/modules/trips/repositories";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `fuel_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export class FuelManagementService implements IFuelManagementService {
  constructor(
    private readonly repository: IFuelRepository,
    private readonly eventRepository: IFinancialEventRepository,
    private readonly tripRepository: ITripRepository,
    private readonly fleetVehicleService: FleetVehicleService,
    private readonly operationalCostService: OperationalCostService
  ) {}

  createFuelLog(input: CreateFuelLogInput) {
    const payload = CreateFuelLogSchema.parse(input);
    const vehicle = this.fleetVehicleService.getVehicleById(payload.vehicleId);
    const trip = this.tripRepository.findById(payload.tripId);

    if (!trip) {
      throw new EntityNotFoundError("Trip", payload.tripId);
    }

    const timestamp = payload.loggedAt ?? nowIso();
    const draft: FuelLog = {
      id: createId(),
      fuelLogNumber: this.repository.nextFuelLogNumber(),
      vehicleId: payload.vehicleId,
      tripId: payload.tripId,
      fuelQuantity: payload.fuelQuantity,
      fuelCost: payload.fuelCost,
      odometerReading: payload.odometerReading,
      fuelStation: payload.fuelStation.trim(),
      notes: payload.notes,
      loggedAt: timestamp,
      placeholders: {
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

    const result = workflowLogFuel({ fuelLog: draft, vehicle, trip });

    if (!result.success) {
      throw result.error;
    }

    const created = this.repository.create(result.data.fuelLog);
    this.appendEvent(created.id, result.data.event);
    this.appendEvent(created.vehicleId, result.data.event);
    this.appendEvent(created.tripId, result.data.event);
    this.recordCostUpdates(created.vehicleId, created.tripId);

    return created;
  }

  getFuelLogById(id: string) {
    const fuelLog = this.repository.findById(id);

    if (!fuelLog) {
      throw new EntityNotFoundError("FuelLog", id);
    }

    return fuelLog;
  }

  getFuelLogDetail(id: string): FuelLogDetail {
    const fuelLog = this.getFuelLogById(id);
    const vehicle = this.fleetVehicleService.findVehicleRecord(fuelLog.vehicleId) ?? undefined;
    const trip = this.tripRepository.findById(fuelLog.tripId) ?? undefined;

    return {
      fuelLog,
      vehicle,
      trip,
      timeline: buildFinancialTimeline(this.eventRepository.listByScopeId(id))
    };
  }

  listFuelLogs(query: FuelListQuery = DEFAULT_FUEL_LIST_QUERY) {
    const page = query.pagination?.page ?? DEFAULT_FUEL_LIST_QUERY.pagination?.page ?? 1;
    const pageSize = query.pagination?.pageSize ?? DEFAULT_FUEL_LIST_QUERY.pagination?.pageSize ?? 10;

    const mergedQuery: FuelListQuery = {
      ...DEFAULT_FUEL_LIST_QUERY,
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

  private recordCostUpdates(vehicleId: string, tripId: string) {
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
    this.appendEvent(tripId, costEvent);
    this.appendEvent(vehicleId, roiEvent);
  }

  private appendEvent(scopeId: string, event: DomainEvent) {
    this.eventRepository.append(scopeId, event);
  }
}
