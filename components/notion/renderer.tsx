import React from 'react'
import { Paragraph } from './blocks/Paragraph'
import { Heading1, Heading2, Heading3 } from './blocks/Heading'
import { BulletedListItem } from './blocks/BulletedList'
import { NumberedListItem } from './blocks/NumberedList'
import { Code } from './blocks/Code'
import { ImageBlock } from './blocks/Image'
import { Quote } from './blocks/Quote'
import { Callout } from './blocks/Callout'
import { Divider } from './blocks/Divider'
import { Bookmark } from './blocks/Bookmark'

const blockComponents: Record<string, React.FC<{ block: any }>> = {
  paragraph: Paragraph,
  heading_1: Heading1,
  heading_2: Heading2,
  heading_3: Heading3,
  bulleted_list_item: BulletedListItem,
  numbered_list_item: NumberedListItem,
  code: Code,
  image: ImageBlock,
  quote: Quote,
  callout: Callout,
  divider: Divider,
  bookmark: Bookmark,
}

export function NotionBlockRenderer({ block }: { block: any }) {
  const Component = blockComponents[block.type]
  if (!Component) {
    const richText = block[block.type]?.rich_text
    if (richText) {
      return <p className="my-4 font-serif text-muted">{renderRichText(richText)}</p>
    }
    return null
  }
  return <Component block={block} />
}

export function NotionRenderer({ blocks }: { blocks: any[] }) {
  return (
    <div>
      {blocks.map((block) => (
        <NotionBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

export function renderRichText(richTexts: any[]): React.ReactNode {
  if (!richTexts?.length) return null

  return richTexts.map((text: any, i: number) => {
    const { annotations, plain_text, href } = text
    let content: React.ReactNode = plain_text

    if (annotations.bold) content = <strong key={i}>{content}</strong>
    if (annotations.italic) content = <em key={i}>{content}</em>
    if (annotations.strikethrough) content = <s key={i}>{content}</s>
    if (annotations.code) {
      content = (
        <code key={i} className="bg-neutral-800 px-1.5 py-0.5 text-sm font-mono text-neutral-300">
          {content}
        </code>
      )
    }
    if (annotations.underline) content = <u key={i}>{content}</u>

    if (href) {
      content = (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-muted/40 hover:border-fg transition-colors"
        >
          {content}
        </a>
      )
    }

    return <React.Fragment key={i}>{content}</React.Fragment>
  })
}
