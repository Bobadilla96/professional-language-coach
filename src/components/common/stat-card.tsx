import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl">{value}</strong>
    </Card>
  );
}
