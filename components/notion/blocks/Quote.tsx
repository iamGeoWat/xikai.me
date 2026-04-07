import { renderRichText } from '../renderer'

export function Quote({ block }: { block: any }) {
  return <blockquote className="my-6 border-l-2 border-muted pl-4 italic font-serif text-muted">{renderRichText(block.quote.rich_text)}</blockquote>
}
