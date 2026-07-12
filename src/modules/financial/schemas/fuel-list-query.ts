import { z } from "zod";
import { PaginationSchema, SearchSchema, SortSchema } from "@/shared/domain/schemas";

export const FuelListQuerySchema = z.object({
  search: SearchSchema.optional(),
  vehicleId: z.string().optional(),
  tripId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: SortSchema.optional(),
  pagination: PaginationSchema.optional()
});

export type FuelListQuery = z.infer<typeof FuelListQuerySchema>;

export const DEFAULT_FUEL_LIST_QUERY: FuelListQuery = {
  sort: { field: "loggedAt", direction: "desc" },
  pagination: { page: 1, pageSize: 10 }
};
