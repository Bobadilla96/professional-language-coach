import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_FOLDERS = [
  { url: "https://drive.google.com/drive/folders/1n4aVyN5-lqBpGsA9DUwcn76p96LXAPwm", archiveLabel: "Units 01-25" },
  { url: "https://drive.google.com/drive/folders/1bKeoEOE_JSOsH4GtECd-nHmZNjKCn4T2", archiveLabel: "Units 26-50" },
  { url: "https://drive.google.com/drive/folders/1bpX6923izj5-NWAfP92fEwRnreoK3-qH", archiveLabel: "Units 51-75" },
  { url: "https://drive.google.com/drive/folders/19gFqqzdqHmzmw-q4l0DcG86m99qYs-6x", archiveLabel: "Units 76-96" }
];

const OUTPUT_PATH = path.join(process.cwd(), "src", "data", "bbc", "bundled-drive-manifest.ts");
const ENTRY_PATTERN = /<div class=\"flip-entry\" id=\"entry-([^\"]+)\".*?<div class=\"flip-entry-title\">([^<]+)<\/div>/gs;

function parseFolderId(input) {
  try {
    const parsed = new URL(input);
    const queryId = parsed.searchParams.get("id");
    if (queryId) return queryId;

    const match = parsed.pathname.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
  } catch {
    // ignore and try raw token path below
  }

  const rawMatch = input.match(/([a-zA-Z0-9_-]{20,})/);
  return rawMatch?.[1] ?? null;
}

function normalizeTitle(title) {
  return title
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getAssetType(title) {
  const normalized = normalizeTitle(title);
  if (normalized.endsWith(".mp3")) return "audio";
  if (normalized.endsWith(".pdf")) return "pdf";
  return null;
}

function extractUnitNumber(title) {
  const normalized = normalizeTitle(title);

  const unitMatch = normalized.match(/unit\s*0*(\d{1,2})/);
  if (unitMatch) return Number(unitMatch[1]);

  const trailingPdfMatch = normalized.match(/(?:^|[^0-9])0*(\d{1,2})(?:\s*-?)?\.pdf$/);
  if (trailingPdfMatch) return Number(trailingPdfMatch[1]);

  return null;
}

function scoreTitle(title, assetType, unitNumber) {
  const normalized = normalizeTitle(title);
  if (assetType === "audio") {
    return normalized.includes(`unit${String(unitNumber).padStart(2, "0")}.mp3`) ? 3 : 1;
  }

  if (normalized.endsWith(`${unitNumber}.pdf`)) return 4;
  if (normalized.endsWith(`${String(unitNumber).padStart(2, "0")}.pdf`)) return 4;
  if (normalized.endsWith(`${unitNumber}-.pdf`)) return 3;
  if (normalized.endsWith(`${String(unitNumber).padStart(2, "0")}-.pdf`)) return 3;
  return 1;
}

async function scrapeFolder(folder) {
  const folderId = parseFolderId(folder.url);
  if (!folderId) {
    throw new Error(`No se pudo extraer el folder id de ${folder.url}`);
  }

  const response = await fetch(`https://drive.google.com/embeddedfolderview?id=${folderId}#list`);
  if (!response.ok) {
    throw new Error(`Drive respondió ${response.status} para ${folder.url}`);
  }

  const html = await response.text();
  const matches = [...html.matchAll(ENTRY_PATTERN)];

  return matches.map((match) => ({
    fileId: match[1],
    title: match[2],
    archiveLabel: folder.archiveLabel
  }));
}

function mergeEntries(entries) {
  const units = new Map();

  for (const entry of entries) {
    const assetType = getAssetType(entry.title);
    const unitNumber = extractUnitNumber(entry.title);
    if (!assetType || !unitNumber) continue;

    const current = units.get(unitNumber) ?? { unitNumber, archiveLabel: entry.archiveLabel };
    const candidate = {
      title: entry.title,
      fileId: entry.fileId,
      score: scoreTitle(entry.title, assetType, unitNumber)
    };

    const currentKey = assetType === "audio" ? "audio" : "pdf";
    if (!current[currentKey] || candidate.score > current[currentKey].score) {
      current[currentKey] = candidate;
      current.archiveLabel = entry.archiveLabel;
    }

    units.set(unitNumber, current);
  }

  return [...units.values()].sort((a, b) => a.unitNumber - b.unitNumber);
}

function renderManifest(units) {
  const lines = [
    "export const bundledBbcDriveManifest = {",
    '  note: "BBC library served from Google Drive (scraped from public folders)",',
    "  units: ["
  ];

  for (const unit of units) {
    if (!unit.audio?.fileId || !unit.pdf?.fileId) {
      continue;
    }

    lines.push("    {");
    lines.push(`      unitNumber: ${unit.unitNumber},`);
    lines.push(`      archiveLabel: "${unit.archiveLabel}",`);
    lines.push(`      audioUrl: "https://drive.google.com/file/d/${unit.audio.fileId}/view?usp=drive_web",`);
    lines.push(`      pdfUrl: "https://drive.google.com/file/d/${unit.pdf.fileId}/view?usp=drive_web",`);
    lines.push("    },");
  }

  lines.push("  ],");
  lines.push("} as const;");
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const scraped = await Promise.all(DEFAULT_FOLDERS.map(scrapeFolder));
  const mergedUnits = mergeEntries(scraped.flat());
  const completeUnits = mergedUnits.filter((unit) => unit.audio?.fileId && unit.pdf?.fileId);
  const missingUnits = mergedUnits.filter((unit) => !unit.audio?.fileId || !unit.pdf?.fileId).map((unit) => unit.unitNumber);

  await writeFile(OUTPUT_PATH, renderManifest(completeUnits), "utf8");

  console.log(`Manifest generado en ${OUTPUT_PATH}`);
  console.log(`Unidades completas: ${completeUnits.length}`);
  if (missingUnits.length) {
    console.log(`Unidades incompletas: ${missingUnits.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
