export type EntityId = string;

export type ModuleKey =
  | "dashboard"
  | "fleet"
  | "drivers"
  | "trips"
  | "maintenance"
  | "fuel"
  | "expenses"
  | "analytics"
  | "settings";

export type SortDirection = "asc" | "desc";

export type Filter<TValue = string> = {
  field: string;
  value: TValue;
  operator?: "equals" | "contains" | "startsWith" | "between" | "in";
};

export type Pagination = {
  page: number;
  pageSize: number;
  total?: number;
};

export type Search = {
  query: string;
  fields?: string[];
};

export type Sort = {
  field: string;
  direction: SortDirection;
};

export type ApiResponse<TData> = {
  data: TData;
  message?: string;
  meta?: {
    pagination?: Pagination;
    filters?: Filter[];
    sort?: Sort;
  };
};

export type KPI = {
  id: string;
  label: string;
  value: number | string;
  delta?: number;
  unit?: string;
};

export type ChartData = {
  label: string;
  value: number;
  category?: string;
};

export type TimelineEvent = {
  id: EntityId;
  title: string;
  description?: string;
  timestamp: string;
  actorId?: EntityId;
  entityId?: EntityId;
};
