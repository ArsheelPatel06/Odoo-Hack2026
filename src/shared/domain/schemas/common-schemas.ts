import { z } from "zod";

export const FilterSchema = z.object({
  field: z.string().min(1),
  value: z.unknown(),
  operator: z.enum(["equals", "contains", "startsWith", "between", "in"]).optional()
});

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative().optional()
});

export const SearchSchema = z.object({
  query: z.string(),
  fields: z.array(z.string()).optional()
});

export const SortSchema = z.object({
  field: z.string().min(1),
  direction: z.enum(["asc", "desc"])
});

export const KPISchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.union([z.number(), z.string()]),
  delta: z.number().optional(),
  unit: z.string().optional()
});

export const ChartDataSchema = z.object({
  label: z.string().min(1),
  value: z.number(),
  category: z.string().optional()
});

export const TimelineEventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  timestamp: z.string().min(1),
  actorId: z.string().optional(),
  entityId: z.string().optional()
});
