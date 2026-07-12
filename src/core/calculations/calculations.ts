export function calculateFuelEfficiency(distance: number, fuelQuantity: number) {
  if (fuelQuantity <= 0) {
    return 0;
  }

  return distance / fuelQuantity;
}

export function calculateOperationalCost(fuelCost: number, maintenanceCost: number) {
  return fuelCost + maintenanceCost;
}

export function calculateVehicleROI(input: {
  revenue: number;
  fuelCost: number;
  maintenanceCost: number;
  acquisitionCost: number;
}) {
  if (input.acquisitionCost <= 0) {
    return 0;
  }

  const netReturn = input.revenue - input.fuelCost - input.maintenanceCost;
  return netReturn / input.acquisitionCost;
}

export function calculateROI(input: {
  revenue: number;
  fuelCost: number;
  maintenanceCost: number;
  acquisitionCost: number;
}) {
  return calculateVehicleROI(input);
}

export function calculateFleetUtilizationPlaceholder(input: {
  activeVehicleHours: number;
  totalAvailableHours: number;
}) {
  if (input.totalAvailableHours <= 0) {
    return 0;
  }

  return input.activeVehicleHours / input.totalAvailableHours;
}
