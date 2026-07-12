function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `vehicle_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
import {
  EntityNotFoundError,
  RegistrationNotUniqueError,
  VehicleRetiredError,
  VehicleStateError
} from "@/core/errors";
import {
  MaintenanceCompleted,
  MaintenanceStarted,
  TripCompleted,
  TripDispatched,
  VehicleArchived,
  VehicleRegistered,
  VehicleRetired,
  type DomainEvent
} from "@/core/events";
import { transitionVehicleStatus } from "@/core/transitions";
import { VehicleValidator } from "@/core/validators";
import { CreateVehicleSchema, UpdateVehicleSchema } from "@/shared/domain/schemas/entity-schemas";
import { VehicleStatus } from "@/shared/domain/enums";
import type { Vehicle } from "@/shared/domain/models";
import {
  DEFAULT_VEHICLE_LIST_QUERY,
  type VehicleListQuery
} from "@/modules/fleet/schemas";
import type {
  IFleetVehicleService,
  IVehicleEventRepository,
  IVehicleRepository
} from "@/modules/fleet/repositories";
import { buildVehicleTimeline } from "@/modules/fleet/services/vehicle-timeline-service";
import type { CreateVehicleInput, UpdateVehicleInput, VehicleDetail } from "@/modules/fleet/types";

function nowIso() {
  return new Date().toISOString();
}

function getVehicleIdFromEvent(event: DomainEvent) {
  if ("vehicleId" in event) {
    return event.vehicleId;
  }

  return null;
}

export class FleetVehicleService implements IFleetVehicleService {
  constructor(
    private readonly repository: IVehicleRepository,
    private readonly eventRepository: IVehicleEventRepository
  ) {}

  createVehicle(input: CreateVehicleInput) {
    const payload = CreateVehicleSchema.parse(input);
    const existing = this.repository.findAll();
    const uniqueness = VehicleValidator.validateRegistrationUnique(payload.registrationNumber, existing);

    if (!uniqueness.valid) {
      throw uniqueness.errors[0] ?? new RegistrationNotUniqueError();
    }

    const timestamp = nowIso();
    const vehicle: Vehicle = {
      id: createId(),
      registrationNumber: payload.registrationNumber.trim(),
      name: payload.name.trim(),
      type: payload.type,
      status: VehicleStatus.Available,
      capacity: payload.capacity,
      odometerReading: payload.odometerReading,
      acquisitionCost: payload.acquisitionCost,
      isArchived: false,
      documentCount: 0,
      placeholders: {
        region: "Unassigned",
        gpsEnabled: false
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const created = this.repository.create(vehicle);
    const event = VehicleRegistered.create({
      vehicleId: created.id,
      registrationNumber: created.registrationNumber,
      timestamp
    });
    this.eventRepository.append(created.id, event);

    return created;
  }

  updateVehicle(id: string, input: UpdateVehicleInput) {
    const payload = UpdateVehicleSchema.parse(input);
    const vehicle = this.getVehicleById(id);

    if (vehicle.isArchived) {
      throw new EntityNotFoundError("Vehicle", id);
    }

    const updated = this.repository.update(id, {
      ...payload,
      updatedAt: nowIso()
    });

    return updated;
  }

  archiveVehicle(id: string) {
    const vehicle = this.getVehicleById(id);

    if (vehicle.isArchived) {
      return vehicle;
    }

    if (vehicle.status === VehicleStatus.OnTrip) {
      throw new VehicleStateError("Cannot archive a vehicle that is currently on trip.");
    }

    const timestamp = nowIso();
    const archived = this.repository.update(id, {
      isArchived: true,
      archivedAt: timestamp,
      updatedAt: timestamp
    });

    this.eventRepository.append(id, VehicleArchived.create({ vehicleId: id, timestamp }));
    return archived;
  }

  retireVehicle(id: string) {
    const vehicle = this.getVehicleById(id);

    if (vehicle.status === VehicleStatus.Retired) {
      return vehicle;
    }

    if (vehicle.status === VehicleStatus.OnTrip) {
      throw new VehicleRetiredError("Cannot retire a vehicle while it is on trip.");
    }

    const timestamp = nowIso();
    const nextStatus = transitionVehicleStatus(vehicle.status, VehicleStatus.Retired);
    const retired = this.repository.update(id, {
      status: nextStatus,
      updatedAt: timestamp
    });

    this.eventRepository.append(id, VehicleRetired.create({ vehicleId: id, timestamp }));
    return retired;
  }

  getVehicleById(id: string) {
    const vehicle = this.repository.findById(id);

    if (!vehicle || vehicle.isArchived) {
      throw new EntityNotFoundError("Vehicle", id);
    }

    return vehicle;
  }

  getVehicleDetail(id: string): VehicleDetail {
    const vehicle = this.getVehicleById(id);
    const timeline = buildVehicleTimeline(this.eventRepository.listByVehicleId(id));

    return {
      vehicle,
      overview: {
        placeholders: {
          gps: "GPS integration placeholder",
          insurance: vehicle.placeholders?.insuranceExpiryAt ?? "Insurance expiry placeholder",
          registrationExpiry: vehicle.placeholders?.registrationExpiryAt ?? "Registration expiry placeholder",
          documents: `${vehicle.documentCount} document placeholders`
        }
      },
      tripHistory: [],
      maintenanceHistory: [],
      fuelLogs: [],
      expenseHistory: [],
      documents: [],
      timeline
    };
  }

  listVehicles(query: VehicleListQuery = DEFAULT_VEHICLE_LIST_QUERY) {
    const page = query.pagination?.page ?? DEFAULT_VEHICLE_LIST_QUERY.pagination?.page ?? 1;
    const pageSize = query.pagination?.pageSize ?? DEFAULT_VEHICLE_LIST_QUERY.pagination?.pageSize ?? 10;

    const mergedQuery: VehicleListQuery = {
      ...DEFAULT_VEHICLE_LIST_QUERY,
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

  recordWorkflowEvent(event: DomainEvent) {
    const vehicleId = getVehicleIdFromEvent(event);

    if (!vehicleId) {
      return;
    }

    this.eventRepository.append(vehicleId, event);

    if (event.type === TripDispatched.type) {
      this.syncVehicleStatus(vehicleId, VehicleStatus.OnTrip);
    }

    if (event.type === TripCompleted.type) {
      this.syncVehicleStatus(vehicleId, VehicleStatus.Available);
    }

    if (event.type === MaintenanceStarted.type) {
      this.syncVehicleStatus(vehicleId, VehicleStatus.InShop);
    }

    if (event.type === MaintenanceCompleted.type) {
      const vehicle = this.repository.findById(vehicleId);

      if (vehicle && vehicle.status !== VehicleStatus.Retired) {
        this.syncVehicleStatus(vehicleId, VehicleStatus.Available);
      }
    }
  }

  findVehicleRecord(id: string) {
    return this.repository.findById(id);
  }

  persistVehicle(vehicle: Vehicle) {
    this.repository.update(vehicle.id, vehicle);
  }

  getDispatchableVehicles() {
    return this.repository
      .findAll()
      .filter((vehicle) => !vehicle.isArchived && vehicle.status === VehicleStatus.Available);
  }

  private syncVehicleStatus(vehicleId: string, status: VehicleStatus) {
    const vehicle = this.repository.findById(vehicleId);

    if (!vehicle || vehicle.status === status || vehicle.status === VehicleStatus.Retired) {
      return;
    }

    try {
      const nextStatus = transitionVehicleStatus(vehicle.status, status);
      this.repository.update(vehicleId, { status: nextStatus, updatedAt: nowIso() });
    } catch {
      return;
    }
  }
}

export function createWorkflowEventRecorders(service: FleetVehicleService) {
  return {
    onTripDispatched: (event: ReturnType<typeof TripDispatched.create>) => service.recordWorkflowEvent(event),
    onTripCompleted: (event: ReturnType<typeof TripCompleted.create>) => service.recordWorkflowEvent(event),
    onMaintenanceStarted: (event: ReturnType<typeof MaintenanceStarted.create>) => service.recordWorkflowEvent(event),
    onMaintenanceCompleted: (event: ReturnType<typeof MaintenanceCompleted.create>) =>
      service.recordWorkflowEvent(event)
  };
}
