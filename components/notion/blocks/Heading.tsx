import { renderRichText } from '../renderer'

export function Heading1({ block }: { block: any }) {
  return (
    <h1 className="mt-12 mb-4 text-3xl font-sans font-semibold tracking-tight">
      {renderRichText(block.heading_1.rich_text)}
    </h1>
  )
}

export function Heading2({ block }: { block: any }) {
  return (
    <h2 className="mt-10 mb-3 text-2xl font-sans font-medium tracking-tight">
      {renderRichText(block.heading_2.rich_text)}
    </h2>
  )
}

export function Heading3({ block }: { block: any }) {
  return (
    <h3 className="mt-8 mb-2 text-xl font-sans font-medium tracking-tight">
      {renderRichText(block.heading_3.rich_text)}
    </h3>
  )
}
