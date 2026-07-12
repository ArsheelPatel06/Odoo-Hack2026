import type { DomainEvent } from "@/core/events";
import type { IDriverEventRepository } from "@/modules/drivers/repositories/interfaces";

export class InMemoryDriverEventRepository implements IDriverEventRepository {
  private events = new Map<string, DomainEvent[]>();

  append(driverId: string, event: DomainEvent) {
    const existing = this.events.get(driverId) ?? [];
    this.events.set(driverId, [...existing, event]);
  }

  listByDriverId(driverId: string) {
    return [...(this.events.get(driverId) ?? [])];
  }
}
