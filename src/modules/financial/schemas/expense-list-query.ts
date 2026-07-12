import { z } from "zod";
import { ExpenseType } from "@/shared/domain/enums";
import { PaginationSchema, SearchSchema, SortSchema } from "@/shared/domain/schemas";

export const ExpenseListQuerySchema = z.object({
  search: SearchSchema.optional(),
  type: z.nativeEnum(ExpenseType).optional(),
  vehicleId: z.string().optional(),
  tripId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: SortSchema.optional(),
  pagination: PaginationSchema.optional()
});

export type ExpenseListQuery = z.infer<typeof ExpenseListQuerySchema>;

export const DEFAULT_EXPENSE_LIST_QUERY: ExpenseListQuery = {
  sort: { field: "incurredAt", direction: "desc" },
  pagination: { page: 1, pageSize: 10 }
};
