import { fleetVehicleService } from "@/shared/mock-data";
import { fleetModule as fleetModuleMeta } from "@/modules/fleet/constants";

export const fleetModule = fleetModuleMeta;

export * from "@/modules/fleet/constants";
export * from "@/modules/fleet/repositories";
export * from "@/modules/fleet/schemas";
export * from "@/modules/fleet/services";
export * from "@/modules/fleet/types";

export { fleetVehicleService };
