import { z } from "zod";
import { DriverStatus, LicenseCategory } from "@/shared/domain/enums";
import { PaginationSchema, SearchSchema, SortSchema } from "@/shared/domain/schemas";

export const LicenseExpiryFilterSchema = z.enum(["valid", "expires_soon", "expired"]);

export const DriverListQuerySchema = z.object({
  search: SearchSchema.optional(),
  status: z.nativeEnum(DriverStatus).optional(),
  licenseCategory: z.nativeEnum(LicenseCategory).optional(),
  licenseExpiry: LicenseExpiryFilterSchema.optional(),
  minSafetyScore: z.number().min(0).max(100).optional(),
  includeArchived: z.boolean().optional(),
  sort: SortSchema.optional(),
  pagination: PaginationSchema.optional()
});

export type DriverListQuery = z.infer<typeof DriverListQuerySchema>;
export type LicenseExpiryFilter = z.infer<typeof LicenseExpiryFilterSchema>;

export const DEFAULT_DRIVER_LIST_QUERY: DriverListQuery = {
  includeArchived: false,
  sort: { field: "createdAt", direction: "desc" },
  pagination: { page: 1, pageSize: 10 }
};
