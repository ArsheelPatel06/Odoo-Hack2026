"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { fleetDriverService } from "@/modules/drivers";
import { DRIVER_STATUS_COLORS } from "@/shared/domain/constants";
import { DriverStatus, LicenseCategory } from "@/shared/domain/enums";
import { Badge, Button, Card, Input, PageHeader, Select, StatusBadge } from "@/shared/components/ui";

const statusToneMap = {
  success: "success",
  primary: "primary",
  warning: "warning",
  danger: "danger",
  muted: "muted"
} as const;

type DriverDetailViewProps = {
  driverId: string;
};

export function DriverDetailView({ driverId }: DriverDetailViewProps) {
  const [detail, setDetail] = useState(() => fleetDriverService.getDriverDetail(driverId));
  const [name, setName] = useState(detail.driver.name);
  const [email, setEmail] = useState(detail.driver.email);
  const [phone, setPhone] = useState(detail.driver.phone);
  const [licenseCategory, setLicenseCategory] = useState(detail.driver.licenseCategory);
  const [licenseExpiresAt, setLicenseExpiresAt] = useState(detail.driver.licenseExpiresAt.slice(0, 10));

  const tone =
    statusToneMap[DRIVER_STATUS_COLORS[detail.driver.status] as keyof typeof statusToneMap] ?? "muted";

  const refresh = () => {
    const nextDetail = fleetDriverService.getDriverDetail(driverId);
    setDetail(nextDetail);
    setName(nextDetail.driver.name);
    setEmail(nextDetail.driver.email);
    setPhone(nextDetail.driver.phone);
    setLicenseCategory(nextDetail.driver.licenseCategory);
    setLicenseExpiresAt(nextDetail.driver.licenseExpiresAt.slice(0, 10));
  };

  const handleSave = () => {
    try {
      fleetDriverService.updateDriver(driverId, {
        name,
        email,
        phone,
        licenseCategory,
        licenseExpiresAt: new Date(licenseExpiresAt).toISOString()
      });
      toast.success("Driver updated.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update driver.");
    }
  };

  const handleSuspend = () => {
    try {
      fleetDriverService.suspendDriver(driverId);
      toast.success("Driver suspended.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to suspend driver.");
    }
  };

  const handleReactivate = () => {
    try {
      fleetDriverService.reactivateDriver(driverId);
      toast.success("Driver reactivated.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reactivate driver.");
    }
  };

  const handleArchive = () => {
    try {
      fleetDriverService.archiveDriver(driverId);
      toast.success("Driver archived.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to archive driver.");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader title={detail.driver.name} description={`${detail.driver.licenseNumber} · ${detail.driver.licenseCategory}`} />
        <Button asChild variant="secondary">
          <Link href="/drivers">Back to registry</Link>
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label={detail.driver.status} tone={tone} />
          <span className="text-sm text-muted">Status is workflow-controlled and cannot be edited manually.</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {detail.compliance
            .filter((indicator) => indicator.active)
            .map((indicator) => (
              <Badge key={indicator.key} tone={indicator.tone}>
                {indicator.label}
              </Badge>
            ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold">Overview</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Email" value={detail.driver.email} />
            <InfoRow label="Phone" value={detail.driver.phone} />
            <InfoRow label="Safety Score" value={`${detail.driver.safetyScore} (read-only)`} />
            <InfoRow label="Driving Experience" value={detail.overview.placeholders.drivingExperience} />
            <InfoRow label="Medical Certificate" value={detail.overview.placeholders.medicalCertificate} />
            <InfoRow label="Training Records" value={detail.overview.placeholders.trainingRecords} />
            <InfoRow label="Accident History" value={detail.overview.placeholders.accidentHistory} />
            <InfoRow label="Emergency Contact" value={detail.overview.placeholders.emergencyContact} />
          </dl>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Edit Driver</h2>
          <div className="mt-4 grid gap-3">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" />
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" />
            <Select value={licenseCategory} onChange={(event) => setLicenseCategory(event.target.value as LicenseCategory)}>
              {Object.values(LicenseCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Input value={licenseExpiresAt} onChange={(event) => setLicenseExpiresAt(event.target.value)} type="date" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave}>Save changes</Button>
              {detail.driver.status === DriverStatus.Suspended ? (
                <Button variant="secondary" onClick={handleReactivate}>
                  Reactivate
                </Button>
              ) : (
                <Button variant="secondary" onClick={handleSuspend}>
                  Suspend
                </Button>
              )}
              <Button variant="danger" onClick={handleArchive}>
                Archive
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold">License Information</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <InfoRow label="License Number" value={detail.licenseInformation.licenseNumber} />
          <InfoRow label="License Category" value={detail.licenseInformation.licenseCategory} />
          <InfoRow label="Expiry Date" value={new Date(detail.licenseInformation.licenseExpiresAt).toLocaleDateString()} />
          <InfoRow label="Compliance" value={detail.licenseInformation.complianceState} />
        </dl>
      </Card>

      <Card>
        <h2 className="text-base font-semibold">Timeline</h2>
        <ol className="mt-4 grid gap-3">
          {detail.timeline.map((event) => (
            <li key={event.id} className="rounded-md border border-border px-4 py-3">
              <div className="font-medium">{event.title}</div>
              {event.description ? <div className="mt-1 text-sm text-muted">{event.description}</div> : null}
              <div className="mt-2 text-xs text-muted">{new Date(event.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <PlaceholderPanel title="Trip History" description="Trip assignments will connect in Commit 7." />
        <PlaceholderPanel title="Safety History" description="Safety events will connect in a future commit." />
        <PlaceholderPanel title="Documents" description="Document management placeholder for future integration." />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </Card>
  );
}
