import { VehicleDetailView } from "@/modules/fleet/components";

type FleetDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FleetDetailPage({ params }: FleetDetailPageProps) {
  const { id } = await params;

  return <VehicleDetailView vehicleId={id} />;
}
