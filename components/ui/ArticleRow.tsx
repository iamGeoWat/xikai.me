import Link from 'next/link'

function formatShortDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function ArticleRow({
  title,
  slug,
  published,
}: {
  title: string
  slug: string
  published: string | null
}) {
  return (
    <Link
      href={`/writing/${slug}`}
      className="flex items-baseline justify-between gap-4 border-b border-neutral-800/50 py-3 text-fg/80 transition-colors duration-200 hover:text-white"
    >
      <span className="font-serif text-base">{title}</span>
      <span className="shrink-0 text-sm text-muted">{formatShortDate(published)}</span>
    </Link>
  )
}
