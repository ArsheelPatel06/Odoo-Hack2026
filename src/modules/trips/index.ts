import { tripManagementService } from "@/shared/mock-data";
import { tripsModule as tripsModuleMeta } from "@/modules/trips/constants";

export const tripsModule = tripsModuleMeta;

export * from "@/modules/trips/constants";
export * from "@/modules/trips/repositories";
export * from "@/modules/trips/schemas";
export * from "@/modules/trips/services";
export * from "@/modules/trips/types";

export { tripManagementService };
