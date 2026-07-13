export const DISPATCH_STEPS = [
  { id: 1, key: "route", label: "Route & Cargo", description: "Define origin, destination, and load" },
  { id: 2, key: "vehicle", label: "Vehicle", description: "Assign an available unit" },
  { id: 3, key: "driver", label: "Driver", description: "Assign a compliant operator" },
  { id: 4, key: "confirm", label: "Dispatch", description: "Validate and release trip" }
] as const;

export const TRIP_LIFECYCLE_STAGES = [
  { status: "Dispatched", label: "Dispatched" },
  { status: "InTransit", label: "In Transit" },
  { status: "Completed", label: "Delivered" }
] as const;
