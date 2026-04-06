export function ImageBlock({ block }: { block: any }) {
  const src = block.image.type === 'external'
    ? block.image.external.url
    : block.image.file.url
  const caption = block.image.caption?.[0]?.plain_text ?? ''

  return (
    <figure className="my-8">
      <img src={src} alt={caption} className="w-full" loading="lazy" />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
