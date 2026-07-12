export type ApiEnvelope<TData> = {
  data: TData;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  message: string;
  code?: string;
};
