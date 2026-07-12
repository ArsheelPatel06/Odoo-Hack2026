import type { DomainEvent } from "@/core/events";
import type { IMaintenanceEventRepository } from "@/modules/maintenance/repositories/interfaces";

export class InMemoryMaintenanceEventRepository implements IMaintenanceEventRepository {
  private events = new Map<string, DomainEvent[]>();

  append(maintenanceId: string, event: DomainEvent) {
    const existing = this.events.get(maintenanceId) ?? [];
    this.events.set(maintenanceId, [...existing, event]);
  }

  listByMaintenanceId(maintenanceId: string) {
    return [...(this.events.get(maintenanceId) ?? [])];
  }
}
