import {
  expenseManagementService,
  fuelManagementService,
  operationalCostService
} from "@/shared/mock-data";
import { financialModule as financialModuleMeta } from "@/modules/financial/constants";

export const financialModule = financialModuleMeta;

export * from "@/modules/financial/constants";
export * from "@/modules/financial/repositories";
export * from "@/modules/financial/schemas";
export * from "@/modules/financial/services";
export * from "@/modules/financial/types";

export { fuelManagementService, expenseManagementService, operationalCostService };
