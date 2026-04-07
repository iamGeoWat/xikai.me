import { renderRichText } from '@/components/notion/rich-text'

export function Code({ block }: { block: any }) {
  const code = block.code
  const language = code?.language ?? ''
  const text = code?.rich_text?.map((t: { plain_text: string }) => t.plain_text).join('') ?? ''
  const caption = code?.caption

  return (
    <figure>
      <pre className="overflow-x-auto rounded-none bg-neutral-900 p-4">
        <code className="font-mono text-sm text-fg" data-language={language}>
          {text}
        </code>
      </pre>
      {caption && caption.length > 0 && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {renderRichText(caption)}
        </figcaption>
      )}
    </figure>
  )
}
