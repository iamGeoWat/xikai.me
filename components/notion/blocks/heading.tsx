import { renderRichText } from '@/components/notion/rich-text'

export function Heading1({ block }: { block: any }) {
  return (
    <h1 className="mt-12 font-sans text-3xl font-bold tracking-tight text-fg">
      {renderRichText(block.heading_1?.rich_text)}
    </h1>
  )
}

export function Heading2({ block }: { block: any }) {
  return (
    <h2 className="mt-10 font-sans text-2xl font-bold tracking-tight text-fg">
      {renderRichText(block.heading_2?.rich_text)}
    </h2>
  )
}

export function Heading3({ block }: { block: any }) {
  return (
    <h3 className="mt-8 font-sans text-xl font-semibold tracking-tight text-fg">
      {renderRichText(block.heading_3?.rich_text)}
    </h3>
  )
}
