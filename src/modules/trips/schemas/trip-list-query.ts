import { z } from "zod";
import { TripStatus } from "@/shared/domain/enums";
import { PaginationSchema, SearchSchema, SortSchema } from "@/shared/domain/schemas";

export const TripListQuerySchema = z.object({
  search: SearchSchema.optional(),
  status: z.nativeEnum(TripStatus).optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: SortSchema.optional(),
  pagination: PaginationSchema.optional()
});

export type TripListQuery = z.infer<typeof TripListQuerySchema>;

export const DEFAULT_TRIP_LIST_QUERY: TripListQuery = {
  sort: { field: "createdAt", direction: "desc" },
  pagination: { page: 1, pageSize: 10 }
};
