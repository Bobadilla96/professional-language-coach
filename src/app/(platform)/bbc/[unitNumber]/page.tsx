import { BbcUnitPage } from "@/features/bbc/bbc-unit-page";

export default async function BbcUnitRoutePage({ params }: { params: Promise<{ unitNumber: string }> }) {
  const { unitNumber } = await params;
  return <BbcUnitPage unitNumber={Number(unitNumber)} />;
}
