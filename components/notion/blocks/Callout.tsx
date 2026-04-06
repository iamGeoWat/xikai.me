import { renderRichText } from '../renderer'

export function Callout({ block }: { block: any }) {
  const icon = block.callout.icon?.emoji ?? ''

  return (
    <div className="my-4 flex gap-3 border border-neutral-800 p-4">
      {icon && <span className="text-lg shrink-0">{icon}</span>}
      <div className="font-serif leading-relaxed">
        {renderRichText(block.callout.rich_text)}
      </div>
    </div>
  )
}
