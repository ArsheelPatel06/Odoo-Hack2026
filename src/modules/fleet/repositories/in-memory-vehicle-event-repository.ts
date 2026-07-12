import type { DomainEvent } from "@/core/events";
import type { IVehicleEventRepository } from "@/modules/fleet/repositories/interfaces";

export class InMemoryVehicleEventRepository implements IVehicleEventRepository {
  private events = new Map<string, DomainEvent[]>();

  append(vehicleId: string, event: DomainEvent) {
    const existing = this.events.get(vehicleId) ?? [];
    this.events.set(vehicleId, [...existing, event]);
  }

  listByVehicleId(vehicleId: string) {
    return [...(this.events.get(vehicleId) ?? [])];
  }
}
