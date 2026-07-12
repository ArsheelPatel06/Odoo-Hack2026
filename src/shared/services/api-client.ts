export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  enableMocks: process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true"
} as const;

export type ApiClientPlaceholder = {
  baseUrl: string;
};

export const apiClient: ApiClientPlaceholder = {
  baseUrl: apiConfig.baseUrl
};
