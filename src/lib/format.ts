export function formatYearMonth(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatPeriod(startAt: string, endAt: string | null | undefined): string {
  const start = formatYearMonth(startAt);
  const end = endAt ? formatYearMonth(endAt) : '진행중';
  return `${start} – ${end}`;
}

/** Newest first, so the most recent work leads each list. */
export function byStartDesc<T extends { startAt: string }>(a: T, b: T): number {
  return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
}
