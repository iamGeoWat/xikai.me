import { renderRichText } from '@/components/notion/rich-text'

export function Paragraph({ block }: { block: any }) {
  const text = block.paragraph?.rich_text
  if (!text || text.length === 0) return <div className="h-4" />

  return (
    <p className="font-serif text-base leading-relaxed text-fg">
      {renderRichText(text)}
    </p>
  )
}
