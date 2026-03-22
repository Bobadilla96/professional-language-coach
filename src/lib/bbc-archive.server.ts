import "server-only";

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface ArchiveSpec {
  fileName: string;
  startUnit: number;
  endUnit: number;
  label: string;
}

interface ArchiveIndex extends ArchiveSpec {
  filePath: string;
  entries: string[];
}

export interface BbcUnit {
  unitNumber: number;
  unitLabel: string;
  archiveLabel: string;
  audioAvailable: boolean;
  pdfAvailable: boolean;
}

const BBC_ROOT = path.join(process.cwd(), "cursos");

let archiveCache: ArchiveIndex[] | null = null;

function formatUnitNumber(unitNumber: number) {
  return String(unitNumber).padStart(2, "0");
}

function listArchiveEntries(filePath: string) {
  const output = execFileSync("tar", ["-tf", filePath], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024
  });

  return output.split(/\r?\n/).filter(Boolean);
}

function discoverArchives(): ArchiveSpec[] {
  if (!fs.existsSync(BBC_ROOT)) return [];

  return fs
    .readdirSync(BBC_ROOT)
    .map((fileName) => {
      const match = fileName.match(/unidad\s*(\d+)\s*-\s*unidad\s*(\d+)\.rar$/i);
      if (!match) return null;

      const startUnit = Number(match[1]);
      const endUnit = Number(match[2]);

      return {
        fileName,
        startUnit,
        endUnit,
        label: `Units ${formatUnitNumber(startUnit)}-${formatUnitNumber(endUnit)}`
      } satisfies ArchiveSpec;
    })
    .filter((archive): archive is ArchiveSpec => Boolean(archive))
    .sort((a, b) => a.startUnit - b.startUnit);
}

function getArchiveIndexes() {
  if (archiveCache) return archiveCache;

  archiveCache = discoverArchives().map((archive) => {
    const filePath = path.join(BBC_ROOT, archive.fileName);
    return {
      ...archive,
      filePath,
      entries: fs.existsSync(filePath) ? listArchiveEntries(filePath) : []
    };
  });

  return archiveCache;
}

function findArchiveForUnit(unitNumber: number) {
  return getArchiveIndexes().find((archive) => unitNumber >= archive.startUnit && unitNumber <= archive.endUnit) ?? null;
}

function findAudioEntry(entries: string[], unitNumber: number) {
  const padded = formatUnitNumber(unitNumber);
  return entries.find((entry) => entry.toLowerCase().endsWith(`unit${padded}.mp3`)) ?? null;
}

function readTrailingPdfNumber(entry: string) {
  const fileName = path.basename(entry);
  const match = fileName.match(/(\d{1,2})(?:-)?\.pdf$/i);
  return match ? Number(match[1]) : null;
}

function findPdfEntry(entries: string[], unitNumber: number) {
  const exactSuffix = `${formatUnitNumber(unitNumber)}.pdf`;
  const candidates = entries
    .filter((entry) => entry.toLowerCase().endsWith(".pdf"))
    .filter((entry) => readTrailingPdfNumber(entry) === unitNumber)
    .sort((a, b) => {
      const aExact = path.basename(a).toLowerCase().endsWith(exactSuffix.toLowerCase()) ? -1 : 0;
      const bExact = path.basename(b).toLowerCase().endsWith(exactSuffix.toLowerCase()) ? -1 : 0;
      if (aExact !== bExact) return aExact - bExact;
      return path.basename(a).length - path.basename(b).length;
    });

  return candidates[0] ?? null;
}

export function getBbcUnitCatalog(): BbcUnit[] {
  return getArchiveIndexes().flatMap((archive) => {
    const units: BbcUnit[] = [];

    for (let unitNumber = archive.startUnit; unitNumber <= archive.endUnit; unitNumber += 1) {
      const audioEntry = findAudioEntry(archive.entries, unitNumber);
      const pdfEntry = findPdfEntry(archive.entries, unitNumber);
      units.push({
        unitNumber,
        unitLabel: `Unit ${formatUnitNumber(unitNumber)}`,
        archiveLabel: archive.label,
        audioAvailable: Boolean(audioEntry),
        pdfAvailable: Boolean(pdfEntry)
      });
    }

    return units;
  });
}

export function getBbcLibrarySummary() {
  const units = getBbcUnitCatalog();
  return {
    totalUnits: units.length,
    withAudio: units.filter((unit) => unit.audioAvailable).length,
    withPdf: units.filter((unit) => unit.pdfAvailable).length
  };
}

export function getBbcUnitAsset(unitNumber: number, asset: "audio" | "pdf") {
  const archive = findArchiveForUnit(unitNumber);
  if (!archive) return null;

  const entry = asset === "audio" ? findAudioEntry(archive.entries, unitNumber) : findPdfEntry(archive.entries, unitNumber);
  if (!entry) return null;

  return {
    archivePath: archive.filePath,
    entry,
    fileName: path.basename(entry)
  };
}

export function extractBbcUnitAsset(unitNumber: number, asset: "audio" | "pdf") {
  const result = getBbcUnitAsset(unitNumber, asset);
  if (!result) return null;

  const buffer = execFileSync("tar", ["-xOf", result.archivePath, result.entry], {
    encoding: "buffer",
    maxBuffer: 128 * 1024 * 1024
  });

  return {
    ...result,
    buffer
  };
}
