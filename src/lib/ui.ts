/** 1 -> "01", 12 -> "12" */
export function padIndex(n: number): string {
  return String(n).padStart(2, '0');
}
