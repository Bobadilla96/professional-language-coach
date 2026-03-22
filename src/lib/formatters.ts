export function percent(value: number) {
  return `${Math.round(value)}%`;
}

export function titleFromSlug(slug: string) {
  return slug.replaceAll("-", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
