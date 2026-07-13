"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fleetVehicleService } from "@/modules/fleet";
import { maintenanceManagementService } from "@/modules/maintenance";
import { MAINTENANCE_STATUS_COLORS } from "@/shared/domain/constants";
import { MaintenancePriority, MaintenanceStatus } from "@/shared/domain/enums";
import type { MaintenanceLog } from "@/shared/domain/models";
import { Button, FilterBar, PageHeader, SearchBar, Select, StatusBadge, TableWrapper } from "@/shared/components/ui";
import { exportToCSV, exportToPDF } from "@/shared/lib/exportUtils";

const toneMap = { success: "success", primary: "primary", warning: "warning", danger: "danger", muted: "muted" } as const;

export function MaintenanceRegistry() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const result = useMemo(() => {
    void refreshKey;

    return maintenanceManagementService.listMaintenance({
      search: search ? { query: search, fields: ["maintenanceNumber", "title", "assignedTechnician"] } : undefined,
      status: status ? (status as MaintenanceStatus) : undefined,
      priority: priority ? (priority as MaintenancePriority) : undefined,
      sort: { field: "openedAt", direction: "desc" },
      pagination: { page: 1, pageSize: 20 }
    });
  }, [priority, refreshKey, search, status]);

  const handleExport = (format: "csv" | "pdf") => {
    const headers = ["ID", "Issue", "Type", "Priority", "Status", "Technician", "Start Date", "Expected", "Cost"];
    const data = result.items.map(m => [
      m.maintenanceNumber,
      m.title,
      m.maintenanceType,
      m.priority,
      m.status,
      m.assignedTechnician,
      new Date(m.openedAt).toLocaleDateString(),
      new Date(m.expectedCompletionAt).toLocaleDateString(),
      m.actualCost ?? m.estimatedCost
    ]);

    if (format === "csv") {
      exportToCSV("fleet_maintenance", headers, data);
    } else {
      exportToPDF("fleet_maintenance", "Maintenance Registry Report", headers, data);
    }
  };

  return (
    <div className="grid gap-6">
      {/* PageHeader removed to prevent duplicate titles */}

      <FilterBar>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, issue, or technician" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-40">
          <option value="">All statuses</option>
          {Object.values(MaintenanceStatus).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)} className="max-w-40">
          <option value="">All priorities</option>
          {Object.values(MaintenancePriority).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <div className="flex gap-2 ml-auto">
          <Button variant="secondary" onClick={() => handleExport("csv")}>CSV</Button>
          <Button variant="secondary" onClick={() => handleExport("pdf")}>PDF</Button>
          <Button variant="primary" onClick={() => setRefreshKey((v) => v + 1)}>Refresh</Button>
        </div>
      </FilterBar>

      <TableWrapper>
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Maintenance ID</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Issue</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Technician</th>
              <th className="px-4 py-3 font-medium">Start Date</th>
              <th className="px-4 py-3 font-medium">Expected Completion</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((record) => (
              <MaintenanceRow key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </TableWrapper>

      <p className="text-sm text-muted">Showing {result.items.length} of {result.total} maintenance records</p>
    </div>
  );
}

function MaintenanceRow({ record }: { record: MaintenanceLog }) {
  const vehicle = fleetVehicleService.findVehicleRecord(record.vehicleId);
  const tone = toneMap[MAINTENANCE_STATUS_COLORS[record.status] as keyof typeof toneMap] ?? "muted";

  return (
    <tr className="border-b border-border/70">
      <td className="px-4 py-3 font-medium">{record.maintenanceNumber}</td>
      <td className="px-4 py-3">{vehicle?.name ?? record.vehicleId}</td>
      <td className="px-4 py-3">{record.title}</td>
      <td className="px-4 py-3">{record.maintenanceType}</td>
      <td className="px-4 py-3">{record.priority}</td>
      <td className="px-4 py-3"><StatusBadge label={record.status} tone={tone} /></td>
      <td className="px-4 py-3">{record.assignedTechnician}</td>
      <td className="px-4 py-3 text-muted">{new Date(record.openedAt).toLocaleDateString()}</td>
      <td className="px-4 py-3 text-muted">{new Date(record.expectedCompletionAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">₹{(record.actualCost ?? record.estimatedCost).toLocaleString()}</td>
      <td className="px-4 py-3">
        <Button asChild variant="ghost" className="h-8 px-2">
          <Link href={`/maintenance/${record.id}`}>View</Link>
        </Button>
      </td>
    </tr>
  );
}
