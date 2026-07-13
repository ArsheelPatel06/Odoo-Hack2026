import { EntityNotFoundError } from "@/core/errors";
import {
  DriverAssignedToTrip,
  TripCancelled,
  TripCreated,
  VehicleAssignedToTrip,
  type DomainEvent
} from "@/core/events";
import {
  assignDriver as workflowAssignDriver,
  assignVehicle as workflowAssignVehicle,
  cancelTrip as workflowCancelTrip,
  completeTrip as workflowCompleteTrip,
  dispatchTrip as workflowDispatchTrip
} from "@/core/workflow";
import { CreateTripSchema, CompleteTripSchema } from "@/shared/domain/schemas/entity-schemas";
import { TripStatus } from "@/shared/domain/enums";
import type { Trip } from "@/shared/domain/models";
import type { FleetDriverService } from "@/modules/drivers/services/fleet-driver-service";
import type { FleetVehicleService } from "@/modules/fleet/services/fleet-vehicle-service";
import {
  DEFAULT_TRIP_LIST_QUERY,
  type TripListQuery
} from "@/modules/trips/schemas";
import type {
  ITripEventRepository,
  ITripManagementService,
  ITripRepository
} from "@/modules/trips/repositories";
import { buildDispatchValidationSummary } from "@/modules/trips/services/dispatch-validation";
import { buildTripTimeline } from "@/modules/trips/services/trip-timeline-service";
import type { CompleteTripInput, CreateTripInput, TripDetail } from "@/modules/trips/types";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `trip_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export class TripManagementService implements ITripManagementService {
  constructor(
    private readonly repository: ITripRepository,
    private readonly eventRepository: ITripEventRepository,
    private readonly fleetVehicleService: FleetVehicleService,
    private readonly fleetDriverService: FleetDriverService
  ) {}

  createTripDraft(input: CreateTripInput) {
    const payload = CreateTripSchema.parse(input);
    const timestamp = nowIso();
    const start = payload.scheduledStartAt ?? timestamp;
    const end = payload.scheduledEndAt ?? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const trip: Trip = {
      id: createId(),
      tripNumber: this.repository.nextTripNumber(),
      status: TripStatus.Draft,
      origin: payload.origin.trim(),
      destination: payload.destination.trim(),
      cargoWeight: payload.cargoWeight,
      plannedDistance: payload.plannedDistance,
      scheduledStartAt: start,
      scheduledEndAt: end,
      placeholders: {
        gpsTracking: "GPS placeholder",
        liveTracking: "Live tracking placeholder",
        eta: "ETA placeholder",
        routeOptimization: "Route optimization placeholder",
        deliveryProof: "Delivery proof placeholder",
        customerSignature: "Customer signature placeholder"
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const created = this.repository.create(trip);
    this.appendTripEvent(
      created.id,
      TripCreated.create({
        tripId: created.id,
        tripNumber: created.tripNumber,
        timestamp
      })
    );

    return created;
  }

  assignVehicle(tripId: string, vehicleId: string) {
    const trip = this.getTripById(tripId);
    const vehicle = this.fleetVehicleService.getVehicleById(vehicleId);
    const result = workflowAssignVehicle({ trip, vehicle });

    if (!result.success) {
      throw result.error;
    }

    const timestamp = nowIso();
    const updated = this.repository.update(tripId, { ...result.data.trip, updatedAt: timestamp });
    this.appendTripEvent(
      tripId,
      VehicleAssignedToTrip.create({ tripId, vehicleId, timestamp })
    );

    return updated;
  }

  assignDriver(tripId: string, driverId: string) {
    const trip = this.getTripById(tripId);
    const driver = this.fleetDriverService.getDriverById(driverId);
    const result = workflowAssignDriver({ trip, driver });

    if (!result.success) {
      throw result.error;
    }

    const timestamp = nowIso();
    const updated = this.repository.update(tripId, { ...result.data.trip, updatedAt: timestamp });
    this.appendTripEvent(
      tripId,
      DriverAssignedToTrip.create({ tripId, driverId, timestamp })
    );

    return updated;
  }

  getDispatchValidation(tripId: string) {
    const trip = this.getTripById(tripId);
    const vehicle = trip.vehicleId ? this.fleetVehicleService.findVehicleRecord(trip.vehicleId) : null;
    const driver = trip.driverId ? this.fleetDriverService.findDriverRecord(trip.driverId) : null;

    return buildDispatchValidationSummary({ trip, vehicle, driver });
  }

  updateTripStatus(tripId: string, status: TripStatus): void {
    const trip = this.getTripById(tripId);
    this.repository.update(tripId, { status });
  }

  dispatchTrip(tripId: string) {
    const trip = this.getTripById(tripId);

    if (!trip.vehicleId || !trip.driverId) {
      throw new EntityNotFoundError("Trip assignment", tripId);
    }

    const vehicle = this.fleetVehicleService.getVehicleById(trip.vehicleId);
    const driver = this.fleetDriverService.getDriverById(trip.driverId);
    const result = workflowDispatchTrip({
      trip,
      vehicle,
      driver,
      cargoWeight: trip.cargoWeight
    });

    if (!result.success) {
      throw result.error;
    }

    this.repository.update(tripId, result.data.trip);
    this.fleetVehicleService.persistVehicle(result.data.vehicle);
    this.fleetDriverService.persistDriver(result.data.driver);
    this.fleetVehicleService.recordWorkflowEvent(result.data.event);
    this.fleetDriverService.recordWorkflowEvent(result.data.event);
    this.appendTripEvent(tripId, result.data.event);

    return result.data.trip;
  }

  completeTrip(tripId: string, input: CompleteTripInput) {
    const payload = CompleteTripSchema.parse(input);
    const trip = this.getTripById(tripId);

    if (!trip.vehicleId || !trip.driverId) {
      throw new EntityNotFoundError("Trip assignment", tripId);
    }

    const vehicle = this.fleetVehicleService.getVehicleById(trip.vehicleId);
    const driver = this.fleetDriverService.getDriverById(trip.driverId);
    const result = workflowCompleteTrip({ trip, vehicle, driver });

    if (!result.success) {
      throw result.error;
    }

    const timestamp = nowIso();
    const completedTrip = this.repository.update(tripId, {
      ...result.data.trip,
      finalOdometer: payload.finalOdometer,
      fuelConsumed: payload.fuelConsumed,
      revenue: payload.revenue,
      completionNotes: payload.completionNotes,
      updatedAt: timestamp
    });

    this.fleetVehicleService.persistVehicle(result.data.vehicle);
    this.fleetDriverService.persistDriver(result.data.driver);
    this.fleetVehicleService.recordWorkflowEvent(result.data.event);
    this.fleetDriverService.recordWorkflowEvent(result.data.event);
    this.appendTripEvent(tripId, result.data.event);

    return completedTrip;
  }

  cancelTrip(tripId: string) {
    const trip = this.getTripById(tripId);
    const vehicle = trip.vehicleId ? this.fleetVehicleService.findVehicleRecord(trip.vehicleId) : null;
    const driver = trip.driverId ? this.fleetDriverService.findDriverRecord(trip.driverId) : null;
    const result = workflowCancelTrip({ trip, vehicle, driver });

    if (!result.success) {
      throw result.error;
    }

    const timestamp = nowIso();
    const cancelled = this.repository.update(tripId, { ...result.data.trip, updatedAt: timestamp });

    if (result.data.vehicle) {
      this.fleetVehicleService.persistVehicle(result.data.vehicle);
    }

    if (result.data.driver) {
      this.fleetDriverService.persistDriver(result.data.driver);
    }

    const cancelEvent = TripCancelled.create({
      tripId,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      timestamp
    });

    this.appendTripEvent(tripId, cancelEvent);

    return cancelled;
  }

  getTripById(id: string) {
    const trip = this.repository.findById(id);

    if (!trip) {
      throw new EntityNotFoundError("Trip", id);
    }

    return trip;
  }

  getTripDetail(id: string): TripDetail {
    const trip = this.getTripById(id);
    const vehicle = trip.vehicleId ? this.fleetVehicleService.findVehicleRecord(trip.vehicleId) ?? undefined : undefined;
    const driver = trip.driverId ? this.fleetDriverService.findDriverRecord(trip.driverId) ?? undefined : undefined;

    return {
      trip,
      vehicle,
      driver,
      liveStatus: {
        currentStatus: trip.status,
        currentStage: this.resolveStage(trip.status),
        estimatedCompletion: trip.scheduledEndAt,
        placeholders: {
          gps: trip.placeholders?.gpsTracking ?? "GPS placeholder",
          liveTracking: trip.placeholders?.liveTracking ?? "Live tracking placeholder",
          eta: trip.placeholders?.eta ?? "ETA placeholder",
          routeOptimization: trip.placeholders?.routeOptimization ?? "Route optimization placeholder",
          deliveryProof: trip.placeholders?.deliveryProof ?? "Delivery proof placeholder",
          customerSignature: trip.placeholders?.customerSignature ?? "Customer signature placeholder"
        }
      },
      overview: {
        cargoWeight: trip.cargoWeight,
        plannedDistance: trip.plannedDistance,
        route: `${trip.origin} → ${trip.destination}`
      },
      fuel: [],
      expenses: [],
      timeline: buildTripTimeline(this.eventRepository.listByTripId(id))
    };
  }

  listTrips(query: TripListQuery = DEFAULT_TRIP_LIST_QUERY) {
    const page = query.pagination?.page ?? DEFAULT_TRIP_LIST_QUERY.pagination?.page ?? 1;
    const pageSize = query.pagination?.pageSize ?? DEFAULT_TRIP_LIST_QUERY.pagination?.pageSize ?? 10;

    const mergedQuery: TripListQuery = {
      ...DEFAULT_TRIP_LIST_QUERY,
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

  getDispatchableVehicles() {
    return this.fleetVehicleService.getDispatchableVehicles();
  }

  getDispatchableDrivers() {
    return this.fleetDriverService.getDispatchableDrivers();
  }

  private resolveStage(status: TripStatus) {
    switch (status) {
      case TripStatus.Draft:
        return "Planning";
      case TripStatus.Dispatched:
        return "In Transit";
      case TripStatus.Completed:
        return "Completed";
      case TripStatus.Cancelled:
        return "Cancelled";
      default:
        return status;
    }
  }

  private appendTripEvent(tripId: string, event: DomainEvent) {
    this.eventRepository.append(tripId, event);
  }
}
