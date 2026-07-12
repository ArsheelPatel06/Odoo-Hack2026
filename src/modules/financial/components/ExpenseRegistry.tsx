"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fleetVehicleService } from "@/modules/fleet";
import { expenseManagementService } from "@/modules/financial";
import { tripManagementService } from "@/modules/trips";
import { ExpenseType } from "@/shared/domain/enums";
import type { Expense } from "@/shared/domain/models";
import { Button, FilterBar, PageHeader, SearchBar, Select, TableWrapper } from "@/shared/components/ui";

export function ExpenseRegistry() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const vehicles = useMemo(() => fleetVehicleService.listVehicles({ pagination: { page: 1, pageSize: 100 } }).items, []);

  const result = useMemo(() => {
    void refreshKey;

    return expenseManagementService.listExpenses({
      search: search ? { query: search, fields: ["expenseNumber", "description", "type"] } : undefined,
      type: type ? (type as ExpenseType) : undefined,
      vehicleId: vehicleId || undefined,
      sort: { field: "incurredAt", direction: "desc" },
      pagination: { page: 1, pageSize: 20 }
    });
  }, [refreshKey, search, type, vehicleId]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader title="Expense Management" description="Operational spend records feeding cost and ROI calculations." />
        <Button asChild>
          <Link href="/expenses/new">Add expense</Link>
        </Button>
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expense ID or description" />
        <Select value={type} onChange={(e) => setType(e.target.value)} className="max-w-44">
          <option value="">All types</option>
          {Object.values(ExpenseType).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="max-w-48">
          <option value="">All vehicles</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name}
            </option>
          ))}
        </Select>
        <Button variant="secondary" onClick={() => setRefreshKey((v) => v + 1)}>
          Refresh
        </Button>
      </FilterBar>

      <TableWrapper>
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Expense ID</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Trip</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((record) => (
              <ExpenseRow key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </TableWrapper>

      <p className="text-sm text-muted">
        Showing {result.items.length} of {result.total} expenses
      </p>
    </div>
  );
}

function ExpenseRow({ record }: { record: Expense }) {
  const vehicle = record.vehicleId ? fleetVehicleService.findVehicleRecord(record.vehicleId) : null;
  const trip = record.tripId ? tripManagementService.getTripById(record.tripId) : null;

  return (
    <tr className="border-b border-border/70">
      <td className="px-4 py-3 font-medium">{record.expenseNumber}</td>
      <td className="px-4 py-3">{record.type}</td>
      <td className="px-4 py-3">{vehicle?.name ?? record.vehicleId ?? "—"}</td>
      <td className="px-4 py-3">{trip?.tripNumber ?? "—"}</td>
      <td className="px-4 py-3">₹{record.amount.toLocaleString()}</td>
      <td className="px-4 py-3 text-muted">{new Date(record.incurredAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">{record.description ?? "—"}</td>
      <td className="px-4 py-3">
        <Button asChild variant="ghost" className="h-8 px-2">
          <Link href={`/expenses/${record.id}`}>View</Link>
        </Button>
      </td>
    </tr>
  );
}
