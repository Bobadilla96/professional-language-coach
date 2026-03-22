import "server-only";

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import { bundledBbcDriveManifest } from "@/data/bbc/bundled-drive-manifest";
import { normalizeGoogleDriveAssetUrl } from "@/lib/google-drive";

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

interface RemoteManifestUnit {
  unitNumber: number;
  unitLabel?: string;
  archiveLabel?: string;
  audioUrl?: string;
  pdfUrl?: string;
}

interface RemoteManifest {
  units: RemoteManifestUnit[];
  note?: string;
}

export interface BbcUnit {
  unitNumber: number;
  unitLabel: string;
  archiveLabel: string;
  audioAvailable: boolean;
  pdfAvailable: boolean;
}

export interface BbcLibrarySummary {
  totalUnits: number;
  withAudio: number;
  withPdf: number;
}

export interface BbcLibraryData {
  source: "local" | "remote" | "unavailable";
  units: BbcUnit[];
  summary: BbcLibrarySummary;
  note: string;
  manifestUrl?: string;
}

export interface BbcUnitAssetReference {
  mode: "local" | "remote";
  href: string;
  openHref: string;
  embedHref?: string;
  fileName: string;
}

const BBC_ROOT = path.join(process.cwd(), "cursos");
const BBC_REMOTE_MANIFEST_URL = process.env.BBC_REMOTE_MANIFEST_URL?.trim();

let archiveCache: ArchiveIndex[] | null = null;

function formatUnitNumber(unitNumber: number) {
  return String(unitNumber).padStart(2, "0");
}

function inferArchiveLabel(unitNumber: number) {
  if (unitNumber <= 25) return "Units 01-25";
  if (unitNumber <= 50) return "Units 26-50";
  if (unitNumber <= 75) return "Units 51-75";
  return "Units 76-96";
}

function buildSummary(units: BbcUnit[]): BbcLibrarySummary {
  return {
    totalUnits: units.length,
    withAudio: units.filter((unit) => unit.audioAvailable).length,
    withPdf: units.filter((unit) => unit.pdfAvailable).length
  };
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
  return buildSummary(getBbcUnitCatalog());
}

function getLocalBbcUnitAsset(unitNumber: number, asset: "audio" | "pdf") {
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
  const result = getLocalBbcUnitAsset(unitNumber, asset);
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

function isRemoteManifestUnit(value: unknown): value is RemoteManifestUnit {
  if (!value || typeof value !== "object") return false;
  const unit = value as Record<string, unknown>;
  return typeof unit.unitNumber === "number";
}

function getBundledRemoteManifest(): RemoteManifest | null {
  if (!bundledBbcDriveManifest.units.length) return null;

  return {
    note: bundledBbcDriveManifest.note,
    units: bundledBbcDriveManifest.units.map((unit) => ({
      unitNumber: unit.unitNumber,
      archiveLabel: unit.archiveLabel,
      audioUrl: unit.audioUrl,
      pdfUrl: unit.pdfUrl
    }))
  };
}

const loadRemoteManifest = cache(async (): Promise<RemoteManifest | null> => {
  if (!BBC_REMOTE_MANIFEST_URL) return getBundledRemoteManifest();

  try {
    const response = await fetch(BBC_REMOTE_MANIFEST_URL, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return getBundledRemoteManifest();
    }

    const data = (await response.json()) as unknown;
    if (!data || typeof data !== "object") return getBundledRemoteManifest();

    const manifest = data as Record<string, unknown>;
    const units = Array.isArray(manifest.units) ? manifest.units.filter(isRemoteManifestUnit) : [];
    if (!units.length) return getBundledRemoteManifest();

    return {
      units,
      note: typeof manifest.note === "string" ? manifest.note : undefined
    };
  } catch {
    return getBundledRemoteManifest();
  }
});

function mapRemoteUnits(units: RemoteManifestUnit[]): BbcUnit[] {
  return units
    .slice()
    .sort((a, b) => a.unitNumber - b.unitNumber)
    .map((unit) => ({
      unitNumber: unit.unitNumber,
      unitLabel: unit.unitLabel?.trim() || `Unit ${formatUnitNumber(unit.unitNumber)}`,
      archiveLabel: unit.archiveLabel?.trim() || inferArchiveLabel(unit.unitNumber),
      audioAvailable: Boolean(unit.audioUrl),
      pdfAvailable: Boolean(unit.pdfUrl)
    }));
}

function readFileNameFromUrl(url: string, fallback: string) {
  try {
    const parsed = new URL(url);
    const name = path.basename(parsed.pathname);
    if (!name || name === "view" || name === "preview" || !name.includes(".")) {
      return fallback;
    }
    return name;
  } catch {
    return fallback;
  }
}

function normalizeRemoteAssetUrl(url: string, asset: "audio" | "pdf") {
  return normalizeGoogleDriveAssetUrl(url, asset);
}

async function getRemoteBbcUnitAsset(unitNumber: number, asset: "audio" | "pdf") {
  const manifest = await loadRemoteManifest();
  if (!manifest) return null;

  const unit = manifest.units.find((entry) => entry.unitNumber === unitNumber);
  if (!unit) return null;

  const href = asset === "audio" ? unit.audioUrl : unit.pdfUrl;
  if (!href) return null;

  const fallbackName = `${formatUnitNumber(unitNumber)}.${asset === "audio" ? "mp3" : "pdf"}`;
  return {
    href,
    fileName: readFileNameFromUrl(href, fallbackName)
  };
}

export async function getBbcLibraryData(): Promise<BbcLibraryData> {
  const localUnits = getBbcUnitCatalog();
  if (localUnits.length > 0) {
    return {
      source: "local",
      units: localUnits,
      summary: buildSummary(localUnits),
      note: "Biblioteca local activa. La app abre cada MP3 o PDF directamente desde tus RAR sin extraer todo al disco."
    };
  }

  const remoteManifest = await loadRemoteManifest();
  if (remoteManifest) {
    const remoteUnits = mapRemoteUnits(remoteManifest.units);
    return {
      source: "remote",
      units: remoteUnits,
      summary: buildSummary(remoteUnits),
      note:
        remoteManifest.note ||
        "Biblioteca remota activa. En este despliegue, los PDF y audios BBC se sirven desde Google Drive mediante un manifiesto.",
      manifestUrl: BBC_REMOTE_MANIFEST_URL || undefined
    };
  }

  return {
    source: "unavailable",
    units: [],
    summary: { totalUnits: 0, withAudio: 0, withPdf: 0 },
    note:
      "No hay archivos BBC disponibles en este despliegue. En local funciona con cursos/*.rar; en produccion usa un manifiesto remoto o el fallback embebido de Drive."
  };
}

export async function getBbcUnitAssetReference(unitNumber: number, asset: "audio" | "pdf"): Promise<BbcUnitAssetReference | null> {
  const localAsset = getLocalBbcUnitAsset(unitNumber, asset);
  if (localAsset) {
    return {
      mode: "local",
      href: `/api/bbc/${unitNumber}/${asset}`,
      openHref: `/api/bbc/${unitNumber}/${asset}`,
      embedHref: asset === "pdf" ? `/api/bbc/${unitNumber}/${asset}` : undefined,
      fileName: localAsset.fileName
    };
  }

  const remoteAsset = await getRemoteBbcUnitAsset(unitNumber, asset);
  if (remoteAsset) {
    const normalized = normalizeRemoteAssetUrl(remoteAsset.href, asset);
    const proxyHref = `/api/bbc/${unitNumber}/${asset}`;
    return {
      mode: "remote",
      href: normalized.href,
      openHref: proxyHref,
      embedHref: asset === "pdf" ? proxyHref : undefined,
      fileName: remoteAsset.fileName
    };
  }

  return null;
}
