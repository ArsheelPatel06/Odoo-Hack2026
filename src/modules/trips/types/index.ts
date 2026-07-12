import type { CreateTripSchema, CompleteTripSchema } from "@/shared/domain/schemas/entity-schemas";
import type { z } from "zod";
import type { Driver, Trip, Vehicle } from "@/shared/domain/models";
import type { TimelineEvent } from "@/shared/domain/types";
import type { TripListQuery } from "@/modules/trips/schemas";

export type CreateTripInput = z.infer<typeof CreateTripSchema>;
export type CompleteTripInput = z.infer<typeof CompleteTripSchema>;

export type DispatchValidationCheck = {
  key: string;
  label: string;
  passed: boolean;
  message: string;
};

export type DispatchValidationSummary = {
  checks: DispatchValidationCheck[];
  readyToDispatch: boolean;
};

export type TripDetail = {
  trip: Trip;
  vehicle?: Vehicle;
  driver?: Driver;
  liveStatus: {
    currentStatus: string;
    currentStage: string;
    estimatedCompletion: string;
    placeholders: {
      gps: string;
      liveTracking: string;
      eta: string;
      routeOptimization: string;
      deliveryProof: string;
      customerSignature: string;
    };
  };
  overview: {
    cargoWeight: number;
    plannedDistance: number;
    route: string;
  };
  fuel: [];
  expenses: [];
  timeline: TimelineEvent[];
};

export type TripListParams = TripListQuery;
