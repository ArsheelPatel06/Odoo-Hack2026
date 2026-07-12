export type TripDispatchedEvent = {
  type: "TripDispatched";
  tripId: string;
  vehicleId: string;
  driverId: string;
  timestamp: string;
};

export const TripDispatched = {
  type: "TripDispatched" as const,
  create(input: Omit<TripDispatchedEvent, "type">): TripDispatchedEvent {
    return { type: "TripDispatched", ...input };
  }
};

export type TripCompletedEvent = {
  type: "TripCompleted";
  tripId: string;
  vehicleId: string;
  driverId: string;
  timestamp: string;
};

export const TripCompleted = {
  type: "TripCompleted" as const,
  create(input: Omit<TripCompletedEvent, "type">): TripCompletedEvent {
    return { type: "TripCompleted", ...input };
  }
};

export type MaintenanceStartedEvent = {
  type: "MaintenanceStarted";
  maintenanceId: string;
  vehicleId: string;
  timestamp: string;
};

export const MaintenanceStarted = {
  type: "MaintenanceStarted" as const,
  create(input: Omit<MaintenanceStartedEvent, "type">): MaintenanceStartedEvent {
    return { type: "MaintenanceStarted", ...input };
  }
};

export type MaintenanceCompletedEvent = {
  type: "MaintenanceCompleted";
  maintenanceId: string;
  vehicleId: string;
  timestamp: string;
};

export const MaintenanceCompleted = {
  type: "MaintenanceCompleted" as const,
  create(input: Omit<MaintenanceCompletedEvent, "type">): MaintenanceCompletedEvent {
    return { type: "MaintenanceCompleted", ...input };
  }
};

export type FuelLoggedEvent = {
  type: "FuelLogged";
  fuelLogId: string;
  vehicleId: string;
  tripId?: string;
  timestamp: string;
};

export const FuelLogged = {
  type: "FuelLogged" as const,
  create(input: Omit<FuelLoggedEvent, "type">): FuelLoggedEvent {
    return { type: "FuelLogged", ...input };
  }
};

export type ExpenseCreatedEvent = {
  type: "ExpenseCreated";
  expenseId: string;
  vehicleId?: string;
  tripId?: string;
  timestamp: string;
};

export const ExpenseCreated = {
  type: "ExpenseCreated" as const,
  create(input: Omit<ExpenseCreatedEvent, "type">): ExpenseCreatedEvent {
    return { type: "ExpenseCreated", ...input };
  }
};

export type VehicleRegisteredEvent = {
  type: "VehicleRegistered";
  vehicleId: string;
  registrationNumber: string;
  timestamp: string;
};

export const VehicleRegistered = {
  type: "VehicleRegistered" as const,
  create(input: Omit<VehicleRegisteredEvent, "type">): VehicleRegisteredEvent {
    return { type: "VehicleRegistered", ...input };
  }
};

export type VehicleRetiredEvent = {
  type: "VehicleRetired";
  vehicleId: string;
  timestamp: string;
};

export const VehicleRetired = {
  type: "VehicleRetired" as const,
  create(input: Omit<VehicleRetiredEvent, "type">): VehicleRetiredEvent {
    return { type: "VehicleRetired", ...input };
  }
};

export type VehicleArchivedEvent = {
  type: "VehicleArchived";
  vehicleId: string;
  timestamp: string;
};

export const VehicleArchived = {
  type: "VehicleArchived" as const,
  create(input: Omit<VehicleArchivedEvent, "type">): VehicleArchivedEvent {
    return { type: "VehicleArchived", ...input };
  }
};

export type DriverRegisteredEvent = {
  type: "DriverRegistered";
  driverId: string;
  licenseNumber: string;
  timestamp: string;
};

export const DriverRegistered = {
  type: "DriverRegistered" as const,
  create(input: Omit<DriverRegisteredEvent, "type">): DriverRegisteredEvent {
    return { type: "DriverRegistered", ...input };
  }
};

export type DriverSuspendedEvent = {
  type: "DriverSuspended";
  driverId: string;
  timestamp: string;
};

export const DriverSuspended = {
  type: "DriverSuspended" as const,
  create(input: Omit<DriverSuspendedEvent, "type">): DriverSuspendedEvent {
    return { type: "DriverSuspended", ...input };
  }
};

export type DriverReactivatedEvent = {
  type: "DriverReactivated";
  driverId: string;
  timestamp: string;
};

export const DriverReactivated = {
  type: "DriverReactivated" as const,
  create(input: Omit<DriverReactivatedEvent, "type">): DriverReactivatedEvent {
    return { type: "DriverReactivated", ...input };
  }
};

export type DriverArchivedEvent = {
  type: "DriverArchived";
  driverId: string;
  timestamp: string;
};

export const DriverArchived = {
  type: "DriverArchived" as const,
  create(input: Omit<DriverArchivedEvent, "type">): DriverArchivedEvent {
    return { type: "DriverArchived", ...input };
  }
};

export type TripCancelledEvent = {
  type: "TripCancelled";
  tripId: string;
  vehicleId?: string;
  driverId?: string;
  timestamp: string;
};

export const TripCancelled = {
  type: "TripCancelled" as const,
  create(input: Omit<TripCancelledEvent, "type">): TripCancelledEvent {
    return { type: "TripCancelled", ...input };
  }
};

export type TripCreatedEvent = {
  type: "TripCreated";
  tripId: string;
  tripNumber: string;
  timestamp: string;
};

export const TripCreated = {
  type: "TripCreated" as const,
  create(input: Omit<TripCreatedEvent, "type">): TripCreatedEvent {
    return { type: "TripCreated", ...input };
  }
};

export type VehicleAssignedToTripEvent = {
  type: "VehicleAssignedToTrip";
  tripId: string;
  vehicleId: string;
  timestamp: string;
};

export const VehicleAssignedToTrip = {
  type: "VehicleAssignedToTrip" as const,
  create(input: Omit<VehicleAssignedToTripEvent, "type">): VehicleAssignedToTripEvent {
    return { type: "VehicleAssignedToTrip", ...input };
  }
};

export type DriverAssignedToTripEvent = {
  type: "DriverAssignedToTrip";
  tripId: string;
  driverId: string;
  timestamp: string;
};

export const DriverAssignedToTrip = {
  type: "DriverAssignedToTrip" as const,
  create(input: Omit<DriverAssignedToTripEvent, "type">): DriverAssignedToTripEvent {
    return { type: "DriverAssignedToTrip", ...input };
  }
};

export type MaintenanceCreatedEvent = {
  type: "MaintenanceCreated";
  maintenanceId: string;
  vehicleId: string;
  maintenanceNumber: string;
  timestamp: string;
};

export const MaintenanceCreated = {
  type: "MaintenanceCreated" as const,
  create(input: Omit<MaintenanceCreatedEvent, "type">): MaintenanceCreatedEvent {
    return { type: "MaintenanceCreated", ...input };
  }
};

export type RepairStartedEvent = {
  type: "RepairStarted";
  maintenanceId: string;
  vehicleId: string;
  timestamp: string;
};

export const RepairStarted = {
  type: "RepairStarted" as const,
  create(input: Omit<RepairStartedEvent, "type">): RepairStartedEvent {
    return { type: "RepairStarted", ...input };
  }
};

export type VehicleReturnedToFleetEvent = {
  type: "VehicleReturnedToFleet";
  maintenanceId: string;
  vehicleId: string;
  timestamp: string;
};

export const VehicleReturnedToFleet = {
  type: "VehicleReturnedToFleet" as const,
  create(input: Omit<VehicleReturnedToFleetEvent, "type">): VehicleReturnedToFleetEvent {
    return { type: "VehicleReturnedToFleet", ...input };
  }
};

export type DomainEvent =
  | TripDispatchedEvent
  | TripCompletedEvent
  | TripCancelledEvent
  | TripCreatedEvent
  | VehicleAssignedToTripEvent
  | DriverAssignedToTripEvent
  | MaintenanceStartedEvent
  | MaintenanceCompletedEvent
  | MaintenanceCreatedEvent
  | RepairStartedEvent
  | VehicleReturnedToFleetEvent
  | FuelLoggedEvent
  | ExpenseCreatedEvent
  | VehicleRegisteredEvent
  | VehicleRetiredEvent
  | VehicleArchivedEvent
  | DriverRegisteredEvent
  | DriverSuspendedEvent
  | DriverReactivatedEvent
  | DriverArchivedEvent;

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void;

export const eventBusPlaceholder = {
  subscribe<T extends DomainEvent>(eventType: T["type"], handler: EventHandler<T>) {
    void eventType;
    void handler;
    return () => undefined;
  },
  publish(event: DomainEvent) {
    void event;
    return undefined;
  }
};
