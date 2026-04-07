import { renderRichText } from '@/components/notion/rich-text'

export function Callout({ block }: { block: any }) {
  const callout = block.callout
  const icon = callout?.icon?.emoji ?? ''

  return (
    <div className="flex items-start gap-3 rounded-none bg-neutral-900 p-4">
      {icon && <span className="text-lg leading-relaxed">{icon}</span>}
      <div className="font-serif text-base leading-relaxed text-fg">
        {renderRichText(callout?.rich_text)}
      </div>
    </div>
  )
}
