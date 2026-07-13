"use client";

import { Button, Drawer, Input, Label, Textarea } from "@/shared/components/ui";

type TripCompletionDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalOdometer: string;
  fuelConsumed: string;
  revenue: string;
  completionNotes: string;
  onFinalOdometerChange: (value: string) => void;
  onFuelConsumedChange: (value: string) => void;
  onRevenueChange: (value: string) => void;
  onCompletionNotesChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

export function TripCompletionDrawer({
  open,
  onOpenChange,
  finalOdometer,
  fuelConsumed,
  revenue,
  completionNotes,
  onFinalOdometerChange,
  onFuelConsumedChange,
  onRevenueChange,
  onCompletionNotesChange,
  onSubmit,
  loading
}: TripCompletionDrawerProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Complete trip"
      description="Release vehicle and driver back to Available through the workflow engine."
    >
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="final-odometer">Final odometer (km)</Label>
          <Input id="final-odometer" type="number" value={finalOdometer} onChange={(e) => onFinalOdometerChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuel-consumed">Fuel consumed (L)</Label>
          <Input id="fuel-consumed" type="number" value={fuelConsumed} onChange={(e) => onFuelConsumedChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="revenue">Revenue (₹)</Label>
          <Input id="revenue" type="number" value={revenue} onChange={(e) => onRevenueChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Completion notes</Label>
          <Textarea id="notes" value={completionNotes} onChange={(e) => onCompletionNotesChange(e.target.value)} />
        </div>
        <div className="flex gap-2 pt-2">
          <Button loading={loading} onClick={onSubmit}>
            Confirm completion
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
