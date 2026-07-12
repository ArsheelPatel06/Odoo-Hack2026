import { MaintenanceDetailView } from "@/modules/maintenance/components";

type MaintenanceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MaintenanceDetailPage({ params }: MaintenanceDetailPageProps) {
  const { id } = await params;

  return <MaintenanceDetailView maintenanceId={id} />;
}
