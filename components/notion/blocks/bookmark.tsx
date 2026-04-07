export function Bookmark({ block }: { block: any }) {
  const url = block.bookmark?.url
  if (!url) return null

  const caption = block.bookmark?.caption?.[0]?.plain_text

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-neutral-800 p-4 transition-colors duration-200 hover:border-muted"
    >
      <span className="text-sm text-fg">{caption || url}</span>
      <span className="mt-1 block truncate text-xs text-muted">{url}</span>
    </a>
  )
}
