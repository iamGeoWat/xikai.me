import { renderRichText } from '../renderer'

export function Paragraph({ block }: { block: any }) {
  return (
    <p className="my-4 leading-relaxed font-serif">
      {renderRichText(block.paragraph.rich_text)}
    </p>
  )
}
