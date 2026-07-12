import { EntityNotFoundError } from "@/core/errors";
import {
  MaintenanceCreated,
  RepairStarted,
  VehicleReturnedToFleet,
  type DomainEvent
} from "@/core/events";
import { closeMaintenance as workflowCloseMaintenance, startMaintenance as workflowStartMaintenance } from "@/core/workflow";
import { CreateMaintenanceSchema, CompleteMaintenanceSchema } from "@/shared/domain/schemas/entity-schemas";
import { MaintenanceStatus } from "@/shared/domain/enums";
import type { MaintenanceLog } from "@/shared/domain/models";
import type { FleetVehicleService } from "@/modules/fleet/services/fleet-vehicle-service";
import {
  DEFAULT_MAINTENANCE_LIST_QUERY,
  type MaintenanceListQuery
} from "@/modules/maintenance/schemas";
import type {
  IMaintenanceEventRepository,
  IMaintenanceManagementService,
  IMaintenanceRepository
} from "@/modules/maintenance/repositories";
import { buildMaintenanceTimeline } from "@/modules/maintenance/services/maintenance-timeline-service";
import type { CompleteMaintenanceInput, CreateMaintenanceInput, MaintenanceDetail } from "@/modules/maintenance/types";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `maintenance_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export class MaintenanceManagementService implements IMaintenanceManagementService {
  constructor(
    private readonly repository: IMaintenanceRepository,
    private readonly eventRepository: IMaintenanceEventRepository,
    private readonly fleetVehicleService: FleetVehicleService
  ) {}

  createMaintenance(input: CreateMaintenanceInput) {
    const payload = CreateMaintenanceSchema.parse(input);
    const vehicle = this.fleetVehicleService.getVehicleById(payload.vehicleId);
    const timestamp = nowIso();

    const draft: MaintenanceLog = {
      id: createId(),
      maintenanceNumber: this.repository.nextMaintenanceNumber(),
      vehicleId: payload.vehicleId,
      status: MaintenanceStatus.Active,
      title: payload.title.trim(),
      description: payload.description,
      maintenanceType: payload.maintenanceType,
      priority: payload.priority,
      assignedTechnician: payload.assignedTechnician.trim(),
      estimatedCost: payload.estimatedCost,
      expectedCompletionAt: payload.expectedCompletionAt,
      openedAt: timestamp,
      placeholders: {
        serviceVendor: "Service vendor placeholder",
        warranty: "Warranty placeholder",
        partsUsed: "Parts used placeholder",
        invoices: "Invoices placeholder",
        photos: "Photos placeholder",
        checklist: "Service checklist placeholder",
        upcomingMaintenance: "Upcoming maintenance placeholder",
        analytics: "Maintenance analytics placeholder"
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const result = workflowStartMaintenance({
      maintenance: draft,
      vehicle,
      maintenanceLogs: this.repository.findAll()
    });

    if (!result.success) {
      throw result.error;
    }

    const created = this.repository.create(result.data.maintenance);
    this.fleetVehicleService.persistVehicle(result.data.vehicle);
    this.fleetVehicleService.recordWorkflowEvent(result.data.event);

    this.appendEvent(
      created.id,
      MaintenanceCreated.create({
        maintenanceId: created.id,
        vehicleId: created.vehicleId,
        maintenanceNumber: created.maintenanceNumber,
        timestamp
      })
    );
    this.appendEvent(created.id, result.data.event);
    this.appendEvent(
      created.id,
      RepairStarted.create({
        maintenanceId: created.id,
        vehicleId: created.vehicleId,
        timestamp
      })
    );

    return created;
  }

  completeMaintenance(id: string, input: CompleteMaintenanceInput) {
    const payload = CompleteMaintenanceSchema.parse(input);
    const maintenance = this.getMaintenanceById(id);
    const vehicle = this.fleetVehicleService.getVehicleById(maintenance.vehicleId);
    const result = workflowCloseMaintenance({ maintenance, vehicle });

    if (!result.success) {
      throw result.error;
    }

    const timestamp = nowIso();
    const completed = this.repository.update(id, {
      ...result.data.maintenance,
      actualCost: payload.actualCost,
      partsCost: payload.partsCost,
      laborCost: payload.laborCost,
      serviceNotes: payload.serviceNotes,
      updatedAt: timestamp
    });

    this.fleetVehicleService.persistVehicle(result.data.vehicle);
    this.fleetVehicleService.recordWorkflowEvent(result.data.event);
    this.appendEvent(id, result.data.event);
    this.appendEvent(
      id,
      VehicleReturnedToFleet.create({
        maintenanceId: id,
        vehicleId: maintenance.vehicleId,
        timestamp
      })
    );

    return completed;
  }

  getMaintenanceById(id: string) {
    const maintenance = this.repository.findById(id);

    if (!maintenance) {
      throw new EntityNotFoundError("Maintenance", id);
    }

    return maintenance;
  }

  getMaintenanceDetail(id: string): MaintenanceDetail {
    const maintenance = this.getMaintenanceById(id);
    const vehicle = this.fleetVehicleService.findVehicleRecord(maintenance.vehicleId) ?? undefined;

    return {
      maintenance,
      vehicle,
      cost: {
        estimatedCost: maintenance.estimatedCost,
        actualCost: maintenance.actualCost,
        partsCost: maintenance.partsCost,
        laborCost: maintenance.laborCost
      },
      overview: {
        placeholders: {
          serviceVendor: maintenance.placeholders?.serviceVendor ?? "Service vendor placeholder",
          warranty: maintenance.placeholders?.warranty ?? "Warranty placeholder",
          partsUsed: maintenance.placeholders?.partsUsed ?? "Parts used placeholder",
          invoices: maintenance.placeholders?.invoices ?? "Invoices placeholder",
          photos: maintenance.placeholders?.photos ?? "Photos placeholder",
          checklist: maintenance.placeholders?.checklist ?? "Checklist placeholder",
          upcomingMaintenance: maintenance.placeholders?.upcomingMaintenance ?? "Upcoming maintenance placeholder",
          analytics: maintenance.placeholders?.analytics ?? "Analytics placeholder"
        }
      },
      serviceNotes: maintenance.serviceNotes ?? "No service notes yet.",
      documents: [],
      timeline: buildMaintenanceTimeline(this.eventRepository.listByMaintenanceId(id))
    };
  }

  listMaintenance(query: MaintenanceListQuery = DEFAULT_MAINTENANCE_LIST_QUERY) {
    const page = query.pagination?.page ?? DEFAULT_MAINTENANCE_LIST_QUERY.pagination?.page ?? 1;
    const pageSize = query.pagination?.pageSize ?? DEFAULT_MAINTENANCE_LIST_QUERY.pagination?.pageSize ?? 10;

    const mergedQuery: MaintenanceListQuery = {
      ...DEFAULT_MAINTENANCE_LIST_QUERY,
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

  getActiveMaintenanceLogs() {
    return this.repository.findAll().filter((record) => record.status === MaintenanceStatus.Active);
  }

  private appendEvent(maintenanceId: string, event: DomainEvent) {
    this.eventRepository.append(maintenanceId, event);
  }
}
