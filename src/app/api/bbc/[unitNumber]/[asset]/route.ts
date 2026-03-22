import { notFound } from "next/navigation";
import { extractBbcUnitAsset, getBbcUnitAssetReference } from "@/lib/bbc-archive.server";

function getContentType(asset: string) {
  if (asset === "audio") return "audio/mpeg";
  if (asset === "pdf") return "application/pdf";
  return "application/octet-stream";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ unitNumber: string; asset: string }> }
) {
  const { unitNumber: rawUnitNumber, asset } = await params;
  const unitNumber = Number(rawUnitNumber);

  if (Number.isNaN(unitNumber) || (asset !== "audio" && asset !== "pdf")) {
    notFound();
  }

  const reference = await getBbcUnitAssetReference(unitNumber, asset);
  if (!reference) {
    notFound();
  }

  if (reference.mode === "remote") {
    const upstreamHeaders = new Headers();
    const range = request.headers.get("range");
    if (range) {
      upstreamHeaders.set("range", range);
    }

    const upstream = await fetch(reference.href, {
      headers: upstreamHeaders,
      redirect: "follow"
    });

    if (!upstream.ok && upstream.status !== 206) {
      notFound();
    }

    const headers = new Headers();
    headers.set("content-type", upstream.headers.get("content-type") || getContentType(asset));
    headers.set("content-disposition", `inline; filename="${encodeURIComponent(reference.fileName)}"`);
    headers.set("cache-control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800");

    const contentLength = upstream.headers.get("content-length");
    if (contentLength) headers.set("content-length", contentLength);

    const contentRange = upstream.headers.get("content-range");
    if (contentRange) headers.set("content-range", contentRange);

    const acceptRanges = upstream.headers.get("accept-ranges");
    if (acceptRanges) headers.set("accept-ranges", acceptRanges);

    const lastModified = upstream.headers.get("last-modified");
    if (lastModified) headers.set("last-modified", lastModified);

    const etag = upstream.headers.get("etag");
    if (etag) headers.set("etag", etag);

    return new Response(upstream.body, {
      status: upstream.status,
      headers
    });
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
