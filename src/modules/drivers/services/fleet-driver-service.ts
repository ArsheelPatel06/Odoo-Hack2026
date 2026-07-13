import {
  DriverStateError,
  EntityNotFoundError,
  LicenseNotUniqueError
} from "@/core/errors";
import {
  DriverArchived,
  DriverReactivated,
  DriverRegistered,
  DriverSuspended,
  TripCompleted,
  TripDispatched,
  type DomainEvent
} from "@/core/events";
import { transitionDriverStatus } from "@/core/transitions";
import { CreateDriverSchema, UpdateDriverSchema } from "@/shared/domain/schemas/entity-schemas";
import { DriverStatus } from "@/shared/domain/enums";
import type { Driver } from "@/shared/domain/models";
import {
  DEFAULT_DRIVER_LIST_QUERY,
  type DriverListQuery
} from "@/modules/drivers/schemas";
import type {
  IDriverEventRepository,
  IDriverRepository,
  IFleetDriverService
} from "@/modules/drivers/repositories";
import {
  buildDriverComplianceIndicators,
  getLicenseComplianceState
} from "@/modules/drivers/services/driver-compliance";
import { buildDriverTimeline } from "@/modules/drivers/services/driver-timeline-service";
import type { CreateDriverInput, DriverDetail, UpdateDriverInput } from "@/modules/drivers/types";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `driver_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function getDriverIdFromEvent(event: DomainEvent) {
  if ("driverId" in event) {
    return event.driverId;
  }

  return null;
}

export class FleetDriverService implements IFleetDriverService {
  constructor(
    private readonly repository: IDriverRepository,
    private readonly eventRepository: IDriverEventRepository
  ) {}

  createDriver(input: CreateDriverInput) {
    const payload = CreateDriverSchema.parse(input);
    const existing = this.repository.findAll();

    if (existing.some((driver) => driver.licenseNumber.toLowerCase() === payload.licenseNumber.toLowerCase())) {
      throw new LicenseNotUniqueError();
    }

    const timestamp = nowIso();
    const driver: Driver = {
      id: createId(),
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      licenseNumber: payload.licenseNumber.trim(),
      licenseCategory: payload.licenseCategory,
      licenseExpiresAt: payload.licenseExpiresAt,
      safetyScore: payload.safetyScore ?? 80,
      status: DriverStatus.Available,
      isArchived: false,
      documentCount: 0,
      placeholders: {
        drivingExperienceYears: 0,
        medicalCertificateStatus: "Placeholder",
        trainingRecords: "Placeholder",
        accidentHistory: "Placeholder",
        emergencyContact: "Placeholder"
      },
      kycStatus: "PENDING",
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const created = this.repository.create(driver);
    this.eventRepository.append(
      created.id,
      DriverRegistered.create({
        driverId: created.id,
        licenseNumber: created.licenseNumber,
        timestamp
      })
    );

    return created;
  }

  updateDriver(id: string, input: UpdateDriverInput) {
    const payload = UpdateDriverSchema.parse(input);
    const driver = this.getDriverById(id);

    if (driver.isArchived) {
      throw new EntityNotFoundError("Driver", id);
    }

    return this.repository.update(id, {
      ...payload,
      email: payload.email?.trim().toLowerCase(),
      updatedAt: nowIso()
    });
  }

  archiveDriver(id: string) {
    const driver = this.repository.findById(id);

    if (!driver) {
      throw new EntityNotFoundError("Driver", id);
    }

    if (driver.isArchived) {
      return driver;
    }

    if (driver.status === DriverStatus.OnTrip) {
      throw new DriverStateError("Cannot archive a driver who is currently on trip.");
    }

    const timestamp = nowIso();
    const archived = this.repository.update(id, {
      isArchived: true,
      archivedAt: timestamp,
      updatedAt: timestamp
    });

    this.eventRepository.append(id, DriverArchived.create({ driverId: id, timestamp }));
    return archived;
  }

  updateKycStatus(id: string, kycStatus: "PENDING" | "VERIFIED" | "FAILED", kycData?: { aadhaarNumber?: string; verifiedName?: string; dob?: string; address?: string; verifiedAt?: string; }) {
    const driver = this.getDriverById(id);
    return this.repository.update(id, {
      kycStatus,
      kycData: kycData || driver.kycData,
      updatedAt: nowIso()
    });
  }

  suspendDriver(id: string) {
    const driver = this.getDriverById(id);

    if (driver.status === DriverStatus.Suspended) {
      return driver;
    }

    if (driver.status === DriverStatus.OnTrip) {
      throw new DriverStateError("Cannot suspend a driver while on trip.");
    }

    const timestamp = nowIso();
    const suspended = this.repository.update(id, {
      status: transitionDriverStatus(driver.status, DriverStatus.Suspended),
      updatedAt: timestamp
    });

    this.eventRepository.append(id, DriverSuspended.create({ driverId: id, timestamp }));
    return suspended;
  }

  reactivateDriver(id: string) {
    const driver = this.getDriverById(id);

    if (driver.status !== DriverStatus.Suspended) {
      throw new DriverStateError("Only suspended drivers can be reactivated.");
    }

    const timestamp = nowIso();
    const reactivated = this.repository.update(id, {
      status: transitionDriverStatus(driver.status, DriverStatus.Available),
      updatedAt: timestamp
    });

    this.eventRepository.append(id, DriverReactivated.create({ driverId: id, timestamp }));
    return reactivated;
  }

  getDriverById(id: string) {
    const driver = this.repository.findById(id);

    if (!driver || driver.isArchived) {
      throw new EntityNotFoundError("Driver", id);
    }

    return driver;
  }

  getDriverDetail(id: string): DriverDetail {
    const driver = this.getDriverById(id);
    const complianceState = getLicenseComplianceState(driver.licenseExpiresAt);

    return {
      driver,
      compliance: buildDriverComplianceIndicators(driver),
      overview: {
        placeholders: {
          drivingExperience: `${driver.placeholders?.drivingExperienceYears ?? 0} years placeholder`,
          medicalCertificate: driver.placeholders?.medicalCertificateStatus ?? "Medical certificate placeholder",
          trainingRecords: driver.placeholders?.trainingRecords ?? "Training records placeholder",
          accidentHistory: driver.placeholders?.accidentHistory ?? "Accident history placeholder",
          emergencyContact: driver.placeholders?.emergencyContact ?? "Emergency contact placeholder"
        }
      },
      tripHistory: [],
      safetyHistory: [],
      licenseInformation: {
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory,
        licenseExpiresAt: driver.licenseExpiresAt,
        complianceState
      },
      documents: [],
      timeline: buildDriverTimeline(this.eventRepository.listByDriverId(id))
    };
  }

  listDrivers(query: DriverListQuery = DEFAULT_DRIVER_LIST_QUERY) {
    const page = query.pagination?.page ?? DEFAULT_DRIVER_LIST_QUERY.pagination?.page ?? 1;
    const pageSize = query.pagination?.pageSize ?? DEFAULT_DRIVER_LIST_QUERY.pagination?.pageSize ?? 10;

    const mergedQuery: DriverListQuery = {
      ...DEFAULT_DRIVER_LIST_QUERY,
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
    const driverId = getDriverIdFromEvent(event);

    if (!driverId) {
      return;
    }

    this.eventRepository.append(driverId, event);

    if (event.type === TripDispatched.type) {
      this.syncDriverStatus(driverId, DriverStatus.OnTrip);
    }

    if (event.type === TripCompleted.type) {
      this.syncDriverStatus(driverId, DriverStatus.Available);
    }
  }

  findDriverRecord(id: string) {
    return this.repository.findById(id);
  }

  persistDriver(driver: Driver) {
    this.repository.update(driver.id, driver);
  }

  getDispatchableDrivers(referenceDate?: string) {
    return this.repository
      .findAll()
      .filter((driver) => {
        if (driver.isArchived || driver.status !== DriverStatus.Available) {
          return false;
        }

        return getLicenseComplianceState(driver.licenseExpiresAt, referenceDate) !== "expired";
      });
  }

  private syncDriverStatus(driverId: string, status: DriverStatus) {
    const driver = this.repository.findById(driverId);

    if (!driver || driver.status === status || driver.status === DriverStatus.Suspended) {
      return;
    }

    try {
      const nextStatus = transitionDriverStatus(driver.status, status);
      this.repository.update(driverId, { status: nextStatus, updatedAt: nowIso() });
    } catch {
      return;
    }
  }
}
