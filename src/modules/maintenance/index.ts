import { maintenanceManagementService } from "@/shared/mock-data";
import { maintenanceModule as maintenanceModuleMeta } from "@/modules/maintenance/constants";

export const maintenanceModule = maintenanceModuleMeta;

export * from "@/modules/maintenance/constants";
export * from "@/modules/maintenance/repositories";
export * from "@/modules/maintenance/schemas";
export * from "@/modules/maintenance/services";
export * from "@/modules/maintenance/types";

export { maintenanceManagementService };
