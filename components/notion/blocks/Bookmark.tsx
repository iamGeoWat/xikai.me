export function Bookmark({ block }: { block: any }) {
  const url = block.bookmark.url
  const caption = block.bookmark.caption?.[0]?.plain_text ?? url

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 block border border-neutral-800 p-4 text-sm text-muted hover:border-fg/30 transition-colors"
    >
      {caption}
    </a>
  )
}
