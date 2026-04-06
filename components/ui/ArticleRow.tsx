import Link from 'next/link'

interface ArticleRowProps {
  title: string
  date: string | null
  slug: string
}

export function ArticleRow({ title, date, slug }: ArticleRowProps) {
  return (
    <Link
      href={`/writing/${slug}`}
      className="group flex items-baseline justify-between gap-4 py-3 border-b border-neutral-800/50"
    >
      <span className="text-fg group-hover:text-white transition-colors">
        {title}
      </span>
      {date && (
        <span className="shrink-0 text-sm text-muted tabular-nums">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
          })}
        </span>
      )}
    </Link>
  )
}
