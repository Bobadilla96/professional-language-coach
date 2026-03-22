import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { SectionTitle } from "@/components/common/section-title";
import { Card } from "@/components/ui/card";
import { getBbcLibrarySummary, getBbcUnitCatalog } from "@/lib/bbc-archive.server";

const GROUPS = [
  { label: "Units 01-25", start: 1, end: 25 },
  { label: "Units 26-50", start: 26, end: 50 },
  { label: "Units 51-75", start: 51, end: 75 },
  { label: "Units 76-96", start: 76, end: 96 }
];

export function BbcLibraryPage() {
  const units = getBbcUnitCatalog();
  const summary = getBbcLibrarySummary();

  return (
    <div className="space-y-5">
      <SectionTitle
        kicker="BBC English Archive"
        title="Biblioteca BBC English"
        description="96 unidades locales con audio MP3 y cuaderno PDF embebido, servidos bajo demanda desde tus archivos RAR."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Unidades</p>
          <strong className="mt-1 block text-2xl">{summary.totalUnits}</strong>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Audios disponibles</p>
          <strong className="mt-1 block text-2xl">{summary.withAudio}</strong>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">PDF disponibles</p>
          <strong className="mt-1 block text-2xl">{summary.withPdf}</strong>
        </Card>
      </section>

      <Card className="space-y-3">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Esta biblioteca funciona sin extraer todo al disco. La app abre cada MP3 o PDF directamente desde el RAR cuando entras a una unidad.
          Es la opcion correcta con el espacio libre actual.
        </p>
      </Card>

      {GROUPS.map((group) => {
        const groupUnits = units.filter((unit) => unit.unitNumber >= group.start && unit.unitNumber <= group.end);
        return (
          <section key={group.label} className="space-y-3">
            <h3 className="text-lg font-semibold">{group.label}</h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {groupUnits.map((unit) => (
                <Card key={unit.unitNumber} className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-300">
                        <BookOpenText size={22} />
                      </div>
                      <p className="text-lg font-semibold">{unit.unitLabel}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{unit.archiveLabel}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className={`rounded-full px-3 py-1 ${unit.audioAvailable ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {unit.audioAvailable ? "Audio" : "Sin audio"}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${unit.pdfAvailable ? "bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {unit.pdfAvailable ? "PDF" : "Sin PDF"}
                    </span>
                  </div>
                  <Link
                    href={`/bbc/${unit.unitNumber}`}
                    className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Abrir unidad
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
