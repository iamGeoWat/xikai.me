/* eslint-disable @next/next/no-img-element */
import { renderRichText } from '@/components/notion/rich-text'

export function ImageBlock({ block }: { block: any }) {
  const image = block.image
  const src =
    image?.type === 'external'
      ? image.external?.url
      : image?.file?.url

  if (!src) return null

  const caption = image?.caption
  const alt = caption?.[0]?.plain_text ?? ''

  return (
    <figure>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full rounded-none"
      />
      {caption && caption.length > 0 && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {renderRichText(caption)}
        </figcaption>
      )}
    </figure>
  )
}
