"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fleetDriverService } from "@/modules/drivers";
import { LicenseCategory } from "@/shared/domain/enums";
import { Button, Card, Input, Select } from "@/shared/components/ui";

export function DriverCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] = useState<LicenseCategory>(LicenseCategory.HMV);
  const [licenseExpiresAt, setLicenseExpiresAt] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const driver = fleetDriverService.createDriver({
        name,
        email,
        phone,
        licenseNumber,
        licenseCategory,
        licenseExpiresAt: new Date(licenseExpiresAt).toISOString()
      });

      toast.success("Driver registered.");
      router.push(`/drivers/${driver.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create driver.");
    }
  };

  return (
    <Card>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required />
        <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
        <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" required />
        <Input
          value={licenseNumber}
          onChange={(event) => setLicenseNumber(event.target.value)}
          placeholder="License number"
          required
        />
        <Select value={licenseCategory} onChange={(event) => setLicenseCategory(event.target.value as LicenseCategory)}>
          {Object.values(LicenseCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Input
          value={licenseExpiresAt}
          onChange={(event) => setLicenseExpiresAt(event.target.value)}
          placeholder="License expiry"
          type="date"
          required
        />
        <p className="text-sm text-muted">
          New drivers are registered as Available. Safety score is assigned automatically and remains read-only.
        </p>
        <Button type="submit">Create driver</Button>
      </form>
    </Card>
  );
}
