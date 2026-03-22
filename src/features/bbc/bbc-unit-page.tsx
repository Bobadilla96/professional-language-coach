import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/common/section-title";
import { Card } from "@/components/ui/card";
import { getBbcUnitAsset } from "@/lib/bbc-archive.server";

function formatUnit(unitNumber: number) {
  return String(unitNumber).padStart(2, "0");
}

export function BbcUnitPage({ unitNumber }: { unitNumber: number }) {
  if (Number.isNaN(unitNumber) || unitNumber < 1 || unitNumber > 96) {
    notFound();
  }

  const audio = getBbcUnitAsset(unitNumber, "audio");
  const pdf = getBbcUnitAsset(unitNumber, "pdf");
  const label = `Unit ${formatUnit(unitNumber)}`;

  if (!audio && !pdf) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <SectionTitle
        kicker="BBC English Archive"
        title={label}
        description="Unidad local basada en tu coleccion BBC English. El audio y el PDF se cargan bajo demanda desde los RAR."
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/bbc" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
          Volver a la biblioteca
        </Link>
        {audio ? (
          <a
            href={`/api/bbc/${unitNumber}/audio`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Abrir audio
          </a>
        ) : null}
        {pdf ? (
          <a
            href={`/api/bbc/${unitNumber}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Abrir PDF
          </a>
        ) : null}
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">PDF embebido</h3>
          {pdf ? (
            <a href={`/api/bbc/${unitNumber}/pdf`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-700 dark:text-sky-300">
              Abrir en pestana nueva
            </a>
          ) : null}
        </div>
        {pdf ? (
          <iframe
            title={`BBC ${label}`}
            src={`/api/bbc/${unitNumber}/pdf`}
            className="h-[1120px] w-full rounded-xl border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">No se encontro el PDF para esta unidad.</p>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Uso recomendado</p>
          <p className="mt-2">Usa el reproductor del sidebar para escuchar la unidad mientras lees el PDF en esta pantalla.</p>
        </div>
      </Card>
    </div>
  );
}
