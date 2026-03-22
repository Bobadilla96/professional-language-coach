import { notFound } from "next/navigation";
import { extractBbcUnitAsset } from "@/lib/bbc-archive.server";

function getContentType(asset: string) {
  if (asset === "audio") return "audio/mpeg";
  if (asset === "pdf") return "application/pdf";
  return "application/octet-stream";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ unitNumber: string; asset: string }> }
) {
  const { unitNumber: rawUnitNumber, asset } = await params;
  const unitNumber = Number(rawUnitNumber);

  if (Number.isNaN(unitNumber) || (asset !== "audio" && asset !== "pdf")) {
    notFound();
  }

  const extracted = extractBbcUnitAsset(unitNumber, asset);
  if (!extracted) {
    notFound();
  }

  return new Response(extracted.buffer, {
    headers: {
      "content-type": getContentType(asset),
      "content-length": String(extracted.buffer.byteLength),
      "content-disposition": `inline; filename="${encodeURIComponent(extracted.fileName)}"`,
      "cache-control": "private, max-age=3600"
    }
  });
}
