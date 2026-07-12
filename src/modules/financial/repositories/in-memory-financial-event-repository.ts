import type { DomainEvent } from "@/core/events";
import type { IFinancialEventRepository } from "@/modules/financial/repositories/interfaces";

export class InMemoryFinancialEventRepository implements IFinancialEventRepository {
  private readonly events = new Map<string, DomainEvent[]>();

  append(scopeId: string, event: DomainEvent) {
    const existing = this.events.get(scopeId) ?? [];
    existing.push(event);
    this.events.set(scopeId, existing);
  }

  listByScopeId(scopeId: string) {
    return [...(this.events.get(scopeId) ?? [])];
  }

  listAll() {
    return [...this.events.values()].flat();
  }
}
