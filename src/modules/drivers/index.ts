import { fleetDriverService } from "@/shared/mock-data";
import { driversModule as driversModuleMeta } from "@/modules/drivers/constants";

export const driversModule = driversModuleMeta;

export * from "@/modules/drivers/constants";
export * from "@/modules/drivers/repositories";
export * from "@/modules/drivers/schemas";
export * from "@/modules/drivers/services";
export * from "@/modules/drivers/types";

export { fleetDriverService };
