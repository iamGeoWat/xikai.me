import React from 'react'
import { Paragraph } from '@/components/notion/blocks/paragraph'
import { Heading1, Heading2, Heading3 } from '@/components/notion/blocks/heading'
import { BulletedListItem, NumberedListItem } from '@/components/notion/blocks/list-item'
import { Code } from '@/components/notion/blocks/code'
import { ImageBlock } from '@/components/notion/blocks/image'
import { Quote } from '@/components/notion/blocks/quote'
import { Callout } from '@/components/notion/blocks/callout'
import { Divider } from '@/components/notion/blocks/divider'
import { Bookmark } from '@/components/notion/blocks/bookmark'
import { renderRichText } from '@/components/notion/rich-text'

function renderBlock(block: any) {
  switch (block.type) {
    case 'paragraph':
      return <Paragraph block={block} />
    case 'heading_1':
      return <Heading1 block={block} />
    case 'heading_2':
      return <Heading2 block={block} />
    case 'heading_3':
      return <Heading3 block={block} />
    case 'bulleted_list_item':
      return <BulletedListItem block={block} />
    case 'numbered_list_item':
      return <NumberedListItem block={block} />
    case 'code':
      return <Code block={block} />
    case 'image':
      return <ImageBlock block={block} />
    case 'quote':
      return <Quote block={block} />
    case 'callout':
      return <Callout block={block} />
    case 'divider':
      return <Divider />
    case 'bookmark':
      return <Bookmark block={block} />
    default: {
      // If the block has rich_text, render as a muted paragraph
      const richText = block[block.type]?.rich_text
      if (richText && richText.length > 0) {
        return (
          <p className="font-serif text-base leading-relaxed text-muted">
            {renderRichText(richText)}
          </p>
        )
      }
      return null
    }
  }
}

/** Group consecutive list items into <ul>/<ol> wrappers */
function groupBlocks(blocks: any[]): { type: string; items: any[] }[] {
  const groups: { type: string; items: any[] }[] = []

  for (const block of blocks) {
    const lastGroup = groups[groups.length - 1]

    if (
      block.type === 'bulleted_list_item' &&
      lastGroup?.type === 'bulleted_list_item'
    ) {
      lastGroup.items.push(block)
    } else if (
      block.type === 'numbered_list_item' &&
      lastGroup?.type === 'numbered_list_item'
    ) {
      lastGroup.items.push(block)
    } else {
      groups.push({ type: block.type, items: [block] })
    }
  }

  return groups
}

export function NotionRenderer({ blocks }: { blocks: any[] }) {
  const groups = groupBlocks(blocks)

  return (
    <>
      {groups.map((group, gi) => {
        if (group.type === 'bulleted_list_item') {
          return (
            <ul key={gi} className="ml-5 space-y-1">
              {group.items.map((block) => (
                <React.Fragment key={block.id}>
                  {renderBlock(block)}
                </React.Fragment>
              ))}
            </ul>
          )
        }

        if (group.type === 'numbered_list_item') {
          return (
            <ol key={gi} className="ml-5 space-y-1">
              {group.items.map((block) => (
                <React.Fragment key={block.id}>
                  {renderBlock(block)}
                </React.Fragment>
              ))}
            </ol>
          )
        }

        return group.items.map((block) => {
          const rendered = renderBlock(block)
          if (!rendered) return null
          return (
            <React.Fragment key={block.id}>
              {rendered}
            </React.Fragment>
          )
        })
      })}
    </>
  )
}
