export const APP_ROUTES = {
  dashboard: "/dashboard",
  fleet: "/fleet",
  drivers: "/drivers",
  trips: "/trips",
  maintenance: "/maintenance",
  fuel: "/fuel",
  expenses: "/expenses",
  analytics: "/analytics",
  settings: "/settings"
} as const;

export type AppRouteKey = keyof typeof APP_ROUTES;
