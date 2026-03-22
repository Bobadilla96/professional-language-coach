export function extractGoogleDriveFileId(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("drive.google.com") && !parsed.hostname.includes("docs.google.com")) {
      return null;
    }

    const fromQuery = parsed.searchParams.get("id");
    if (fromQuery) return fromQuery;

    const match = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function normalizeGoogleDriveAssetUrl(url: string, asset: "audio" | "pdf") {
  const driveFileId = extractGoogleDriveFileId(url);
  if (!driveFileId) {
    return {
      openHref: url,
      embedHref: asset === "pdf" ? url : undefined
    };
  }

  if (asset === "audio") {
    return {
      openHref: `https://drive.google.com/uc?export=download&id=${driveFileId}`,
      embedHref: undefined
    };
  }

  return {
    openHref: `https://drive.google.com/file/d/${driveFileId}/view`,
    embedHref: `https://drive.google.com/file/d/${driveFileId}/preview`
  };
}
