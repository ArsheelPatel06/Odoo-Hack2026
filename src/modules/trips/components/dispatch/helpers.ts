import type { Vehicle } from "@/shared/domain/models";

export type CapacityFit = "ok" | "tight" | "exceeded";

export function getVehicleCapacityFit(vehicle: Vehicle, cargoWeight: number) {
  if (cargoWeight <= 0 || vehicle.capacity <= 0) {
    return { fit: "ok" as CapacityFit, percent: 0, label: "Within capacity", message: "Cargo fits vehicle capacity." };
  }

  const percent = Math.round((cargoWeight / vehicle.capacity) * 100);

  if (cargoWeight > vehicle.capacity) {
    const overBy = cargoWeight - vehicle.capacity;
    return {
      fit: "exceeded" as CapacityFit,
      percent,
      label: "Over capacity",
      message: `Exceeds limit by ${overBy.toLocaleString()} kg.`
    };
  }

  if (percent >= 85) {
    return {
      fit: "tight" as CapacityFit,
      percent,
      label: "Near limit",
      message: `Using ${percent}% of ${vehicle.capacity.toLocaleString()} kg capacity.`
    };
  }

  return {
    fit: "ok" as CapacityFit,
    percent,
    label: "Within capacity",
    message: `Using ${percent}% of ${vehicle.capacity.toLocaleString()} kg capacity.`
  };
}

export function countPassingChecks(checks: Array<{ passed: boolean }>) {
  return checks.filter((check) => check.passed).length;
}
