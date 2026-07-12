import { canDispatchTrip } from "@/core/engine";
import { CAPACITY_VALIDATION } from "@/shared/domain/business-rules";
import type { Driver, Trip, Vehicle } from "@/shared/domain/models";
import { DriverValidator } from "@/core/validators";
import { VehicleValidator } from "@/core/validators";
import { getLicenseComplianceState } from "@/modules/drivers/services/driver-compliance";
import type { DispatchValidationCheck, DispatchValidationSummary } from "@/modules/trips/types";

function check(key: string, label: string, passed: boolean, success: string, failure: string): DispatchValidationCheck {
  return { key, label, passed, message: passed ? success : failure };
}

export function buildDispatchValidationSummary(input: {
  trip: Trip;
  vehicle?: Vehicle | null;
  driver?: Driver | null;
}): DispatchValidationSummary {
  const checks: DispatchValidationCheck[] = [];
  const { trip, vehicle, driver } = input;

  checks.push(
    check(
      "vehicle_assigned",
      "Vehicle Assigned",
      Boolean(vehicle),
      "Vehicle has been selected for this trip.",
      "Select a vehicle before dispatch."
    )
  );

  checks.push(
    check(
      "driver_assigned",
      "Driver Assigned",
      Boolean(driver),
      "Driver has been selected for this trip.",
      "Select a driver before dispatch."
    )
  );

  if (vehicle) {
    const vehicleValidation = VehicleValidator.validateForDispatch(vehicle);
    checks.push(
      check(
        "vehicle_available",
        "Vehicle Available",
        vehicleValidation.valid,
        "Vehicle is available for dispatch.",
        vehicleValidation.valid ? "" : vehicleValidation.errors[0]?.message ?? "Vehicle is not available."
      )
    );
  }

  if (driver) {
    const driverValidation = DriverValidator.validateForAssignment(driver);
    const licenseState = getLicenseComplianceState(driver.licenseExpiresAt);
    checks.push(
      check(
        "driver_available",
        "Driver Available",
        driverValidation.valid,
        "Driver is available for dispatch.",
        driverValidation.valid ? "" : driverValidation.errors[0]?.message ?? "Driver is not available."
      )
    );
    checks.push(
      check(
        "license_valid",
        "License Valid",
        licenseState !== "expired",
        "Driver license is valid.",
        licenseState === "expires_soon" ? "Driver license expires soon." : "Driver license is expired."
      )
    );
  }

  if (vehicle && CAPACITY_VALIDATION.preventsOverCapacityTrip) {
    const passed = trip.cargoWeight <= vehicle.capacity;
    const overBy = trip.cargoWeight - vehicle.capacity;
    checks.push(
      check(
        "capacity",
        "Vehicle Capacity",
        passed,
        `Cargo ${trip.cargoWeight} kg fits within ${vehicle.capacity} kg capacity.`,
        passed
          ? ""
          : `Capacity exceeded by ${overBy} kg. Cargo ${trip.cargoWeight} kg exceeds vehicle limit ${vehicle.capacity} kg.`
      )
    );
  }

  if (vehicle && driver) {
    const workflowValidation = canDispatchTrip({
      trip,
      vehicle,
      driver,
      cargoWeight: trip.cargoWeight
    });

    checks.push(
      check(
        "workflow_ready",
        "Ready to Dispatch",
        workflowValidation.valid,
        "All workflow validations passed.",
        workflowValidation.valid ? "" : workflowValidation.errors[0]?.message ?? "Workflow validation failed."
      )
    );
  } else {
    checks.push(
      check("workflow_ready", "Ready to Dispatch", false, "", "Complete vehicle and driver assignment before dispatch.")
    );
  }

  return {
    checks,
    readyToDispatch: checks.every((item) => item.passed)
  };
}
