export function isoToDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return '';
  return iso.slice(0, 16);
}

export function datetimeLocalToIso(value: string): string {
  if (!value) return '';
  return value.length === 16 ? `${value}:00` : value;
}

export function parseLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
