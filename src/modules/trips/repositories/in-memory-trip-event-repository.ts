import type { DomainEvent } from "@/core/events";
import type { ITripEventRepository } from "@/modules/trips/repositories/interfaces";

export class InMemoryTripEventRepository implements ITripEventRepository {
  private events = new Map<string, DomainEvent[]>();

  append(tripId: string, event: DomainEvent) {
    const existing = this.events.get(tripId) ?? [];
    this.events.set(tripId, [...existing, event]);
  }

  listByTripId(tripId: string) {
    return [...(this.events.get(tripId) ?? [])];
  }
}
