export function formatYearMonth(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatPeriod(startAt: string, endAt: string | null | undefined): string {
  const start = formatYearMonth(startAt);
  const end = endAt ? formatYearMonth(endAt) : '진행중';
  return `${start} – ${end}`;
}
