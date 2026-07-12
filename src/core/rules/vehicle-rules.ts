import type { Vehicle } from "@/shared/domain/models";
import { VehicleStatus } from "@/shared/domain/enums";
import {
  RegistrationNotUniqueError,
  VehicleInShopError,
  VehicleRetiredError,
  VehicleUnavailableError
} from "@/core/errors";

export function isRegistrationUnique(registrationNumber: string, vehicles: Vehicle[], excludeId?: string) {
  return !vehicles.some(
    (vehicle) =>
      vehicle.registrationNumber.toLowerCase() === registrationNumber.toLowerCase() && vehicle.id !== excludeId
  );
}

export function assertRegistrationUnique(registrationNumber: string, vehicles: Vehicle[], excludeId?: string) {
  if (!isRegistrationUnique(registrationNumber, vehicles, excludeId)) {
    throw new RegistrationNotUniqueError();
  }
}

export function isVehicleAvailable(vehicle: Vehicle) {
  return vehicle.status === VehicleStatus.Available;
}

export function isVehicleNotRetired(vehicle: Vehicle) {
  return vehicle.status !== VehicleStatus.Retired;
}

export function isVehicleNotInShop(vehicle: Vehicle) {
  return vehicle.status !== VehicleStatus.InShop;
}

export function isVehicleNotOnTrip(vehicle: Vehicle) {
  return vehicle.status !== VehicleStatus.OnTrip;
}

export function assertVehicleAvailable(vehicle: Vehicle) {
  if (vehicle.status === VehicleStatus.Retired) {
    throw new VehicleRetiredError();
  }

  if (vehicle.status === VehicleStatus.InShop) {
    throw new VehicleInShopError();
  }

  if (vehicle.status === VehicleStatus.OnTrip) {
    throw new VehicleUnavailableError("Vehicle is already on a trip.");
  }

  if (vehicle.status !== VehicleStatus.Available) {
    throw new VehicleUnavailableError();
  }
}
