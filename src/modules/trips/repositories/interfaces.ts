import type { DomainEvent } from "@/core/events";
import type { Trip } from "@/shared/domain/models";
import type { TripListQuery } from "@/modules/trips/schemas";
import type { CompleteTripInput, CreateTripInput, DispatchValidationSummary, TripDetail } from "@/modules/trips/types";

export interface ITripRepository {
  findAll(): Trip[];
  findById(id: string): Trip | null;
  create(trip: Trip): Trip;
  update(id: string, patch: Partial<Trip>): Trip;
  query(query: TripListQuery): { items: Trip[]; total: number };
  nextTripNumber(): string;
}

export interface ITripEventRepository {
  append(tripId: string, event: DomainEvent): void;
  listByTripId(tripId: string): DomainEvent[];
}

export interface ITripManagementService {
  createTripDraft(input: CreateTripInput): Trip;
  assignVehicle(tripId: string, vehicleId: string): Trip;
  assignDriver(tripId: string, driverId: string): Trip;
  getDispatchValidation(tripId: string): DispatchValidationSummary;
  dispatchTrip(tripId: string): Trip;
  completeTrip(tripId: string, input: CompleteTripInput): Trip;
  cancelTrip(tripId: string): Trip;
  getTripById(id: string): Trip;
  getTripDetail(id: string): TripDetail;
  listTrips(query?: TripListQuery): { items: Trip[]; total: number; page: number; pageSize: number };
}
