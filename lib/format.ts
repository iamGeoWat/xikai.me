const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function fmtDate(iso: string | null): string {
  if (!iso) return ''
  const isYearMonth = iso.length === 7
  const d = new Date(iso + (isYearMonth ? '-01' : ''))
  const m = MONTHS[d.getUTCMonth()]
  return isYearMonth ? `${m} ${d.getUTCFullYear()}` : `${m} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

export function fmtDateShort(iso: string | null): string {
  if (!iso) return ''
  const isYearMonth = iso.length === 7
  const d = new Date(iso + (isYearMonth ? '-01' : ''))
  const m = MONTHS[d.getUTCMonth()]
  return isYearMonth
    ? `${m} ${d.getUTCFullYear()}`
    : `${m} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

export function readTime(description: string): number {
  const words = description.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 40))
}
