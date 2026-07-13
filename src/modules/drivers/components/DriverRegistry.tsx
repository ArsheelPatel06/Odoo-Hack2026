"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fleetDriverService } from "@/modules/drivers";
import { buildDriverComplianceIndicators } from "@/modules/drivers/services/driver-compliance";
import { DRIVER_STATUS_COLORS } from "@/shared/domain/constants";
import { DriverStatus, LicenseCategory } from "@/shared/domain/enums";
import type { Driver } from "@/shared/domain/models";
import { Badge, Button, FilterBar, PageHeader, SearchBar, Select, StatusBadge, TableWrapper } from "@/shared/components/ui";
import { exportToCSV, exportToPDF } from "@/shared/lib/exportUtils";

const statusToneMap = {
  success: "success",
  primary: "primary",
  warning: "warning",
  danger: "danger",
  muted: "muted"
} as const;

export function DriverRegistry() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [licenseCategory, setLicenseCategory] = useState<string>("");
  const [licenseExpiry, setLicenseExpiry] = useState<string>("");
  const [minSafetyScore, setMinSafetyScore] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const result = useMemo(() => {
    void refreshKey;

    return fleetDriverService.listDrivers({
      search: search ? { query: search, fields: ["name", "licenseNumber", "email", "phone"] } : undefined,
      status: status ? (status as DriverStatus) : undefined,
      licenseCategory: licenseCategory ? (licenseCategory as LicenseCategory) : undefined,
      licenseExpiry: licenseExpiry ? (licenseExpiry as "valid" | "expires_soon" | "expired") : undefined,
      minSafetyScore: minSafetyScore ? Number(minSafetyScore) : undefined,
      sort: { field: "safetyScore", direction: "desc" },
      pagination: { page: 1, pageSize: 20 }
    });
  }, [licenseCategory, licenseExpiry, minSafetyScore, refreshKey, search, status]);

  const handleExport = (format: "csv" | "pdf") => {
    const headers = ["Name", "License Number", "Category", "Expiry Date", "Phone", "Email", "Safety Score", "Status"];
    const data = result.items.map(d => [
      d.name,
      d.licenseNumber,
      d.licenseCategory,
      new Date(d.licenseExpiresAt).toLocaleDateString(),
      d.phone,
      d.email,
      d.safetyScore,
      d.status
    ]);

    if (format === "csv") {
      exportToCSV("fleet_drivers", headers, data);
    } else {
      exportToPDF("fleet_drivers", "Driver Registry Report", headers, data);
    }
  };

  return (
    <div className="grid gap-6">
      {/* PageHeader removed to prevent duplicate titles */}

      <FilterBar>
        <SearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, license, email, or phone"
        />
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="max-w-44">
          <option value="">All statuses</option>
          {Object.values(DriverStatus).map((driverStatus) => (
            <option key={driverStatus} value={driverStatus}>
              {driverStatus}
            </option>
          ))}
        </Select>
        <Select value={licenseCategory} onChange={(event) => setLicenseCategory(event.target.value)} className="max-w-44">
          <option value="">All categories</option>
          {Object.values(LicenseCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Select value={licenseExpiry} onChange={(event) => setLicenseExpiry(event.target.value)} className="max-w-44">
          <option value="">License expiry</option>
          <option value="valid">Valid</option>
          <option value="expires_soon">Expires soon</option>
          <option value="expired">Expired</option>
        </Select>
        <Select value={minSafetyScore} onChange={(event) => setMinSafetyScore(event.target.value)} className="max-w-44">
          <option value="">Safety score</option>
          <option value="95">95+</option>
          <option value="90">90+</option>
          <option value="85">85+</option>
        </Select>
        <div className="flex gap-2 ml-auto">
          <Button variant="secondary" onClick={() => handleExport("csv")}>
            CSV
          </Button>
          <Button variant="secondary" onClick={() => handleExport("pdf")}>
            PDF
          </Button>
          <Button variant="primary" onClick={() => setRefreshKey((value) => value + 1)}>
            Refresh
          </Button>
        </div>
      </FilterBar>

      <TableWrapper>
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Driver Name</th>
              <th className="px-4 py-3 font-medium">License Number</th>
              <th className="px-4 py-3 font-medium">License Category</th>
              <th className="px-4 py-3 font-medium">Expiry Date</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Safety Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Compliance</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((driver) => (
              <DriverRow key={driver.id} driver={driver} />
            ))}
          </tbody>
        </table>
      </TableWrapper>

      <p className="text-sm text-muted">
        Showing {result.items.length} of {result.total} drivers
      </p>
    </div>
  );
}

function DriverRow({ driver }: { driver: Driver }) {
  const tone = statusToneMap[DRIVER_STATUS_COLORS[driver.status] as keyof typeof statusToneMap] ?? "muted";
  const compliance = buildDriverComplianceIndicators(driver).filter((indicator) => indicator.active);

  return (
    <tr className="border-b border-border/70">
      <td className="px-4 py-3 font-medium">{driver.name}</td>
      <td className="px-4 py-3">{driver.licenseNumber}</td>
      <td className="px-4 py-3">{driver.licenseCategory}</td>
      <td className="px-4 py-3">{new Date(driver.licenseExpiresAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <div>{driver.phone}</div>
        <div className="text-xs text-muted">{driver.email}</div>
      </td>
      <td className="px-4 py-3 font-medium">{driver.safetyScore}</td>
      <td className="px-4 py-3">
        <StatusBadge label={driver.status} tone={tone} />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {compliance.map((indicator) => (
            <Badge key={indicator.key} tone={indicator.tone}>
              {indicator.label}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-muted">{new Date(driver.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <Button asChild variant="ghost" className="h-8 px-2">
          <Link href={`/drivers/${driver.id}`}>View</Link>
        </Button>
      </td>
    </tr>
  );
}
