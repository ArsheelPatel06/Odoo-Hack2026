import { FuelDetailView } from "@/modules/financial/components";

type FuelDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FuelDetailPage({ params }: FuelDetailPageProps) {
  const { id } = await params;

  return <FuelDetailView fuelLogId={id} />;
}
