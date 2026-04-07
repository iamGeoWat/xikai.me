import { renderRichText } from '@/components/notion/rich-text'

export function Quote({ block }: { block: any }) {
  return (
    <blockquote className="border-l-2 border-muted pl-4 italic text-fg">
      {renderRichText(block.quote?.rich_text)}
    </blockquote>
  )
}
