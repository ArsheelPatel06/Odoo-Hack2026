import { fuelManagementService } from "@/shared/mock-data";

export const fuelModule = {
  key: "fuel",
  label: "Fuel"
} as const;

export * from "@/modules/financial";

export { fuelManagementService };
