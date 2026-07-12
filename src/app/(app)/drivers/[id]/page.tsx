import { DriverDetailView } from "@/modules/drivers/components";

type DriverDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DriverDetailPage({ params }: DriverDetailPageProps) {
  const { id } = await params;

  return <DriverDetailView driverId={id} />;
}
