import { z } from "zod";
import { VehicleStatus, VehicleType } from "@/shared/domain/enums";
import { PaginationSchema, SearchSchema, SortSchema } from "@/shared/domain/schemas";

export const VehicleListQuerySchema = z.object({
  search: SearchSchema.optional(),
  type: z.nativeEnum(VehicleType).optional(),
  status: z.nativeEnum(VehicleStatus).optional(),
  includeArchived: z.boolean().optional(),
  sort: SortSchema.optional(),
  pagination: PaginationSchema.optional()
});

export type VehicleListQuery = z.infer<typeof VehicleListQuerySchema>;

export const DEFAULT_VEHICLE_LIST_QUERY: VehicleListQuery = {
  includeArchived: false,
  sort: { field: "createdAt", direction: "desc" },
  pagination: { page: 1, pageSize: 10 }
};
