import React from 'react'
import type { ExtendedRecordMap, Block } from 'notion-types'
import { getTextContent } from 'notion-utils'
import { RichText } from './rich-text'

function NotionBlock({
  block,
  recordMap,
}: {
  block: Block
  recordMap: ExtendedRecordMap
}) {
  const type = block.type as string
  const { properties, format } = block

  switch (type) {
    case 'text': {
      if (!properties?.title) return <div className="h-4" />
      return (
        <p className="text-ink leading-[1.7] mb-4 text-[17px] font-display">
          <RichText decorations={properties.title} />
        </p>
      )
    }

    case 'header':
      return (
        <h1 className="font-display text-3xl font-normal text-ink mt-12 mb-4 tracking-tight">
          <RichText decorations={properties?.title} />
        </h1>
      )

    case 'sub_header':
      return (
        <h2 className="font-display text-2xl font-normal text-ink mt-10 mb-3 tracking-tight">
          <RichText decorations={properties?.title} />
        </h2>
      )

    case 'sub_sub_header':
      return (
        <h3 className="font-sans text-lg font-medium text-ink mt-8 mb-2">
          <RichText decorations={properties?.title} />
        </h3>
      )

    case 'bulleted_list':
    case 'numbered_list':
      return (
        <li className="text-ink leading-[1.7] font-display text-[17px] mb-1">
          <RichText decorations={properties?.title} />
          {block.content && (
            <NotionBlocks blockIds={block.content} recordMap={recordMap} />
          )}
        </li>
      )

    case 'code': {
      const code = getTextContent(properties?.title)
      const language = properties?.language?.[0]?.[0] || ''
      return (
        <pre className="bg-paperAlt/50 border border-rule p-4 overflow-x-auto my-6 font-mono text-[13px]">
          <code className="text-ink">{code}</code>
          {language && (
            <span className="text-[10px] text-mute mt-2 block uppercase tracking-wider">
              {language}
            </span>
          )}
        </pre>
      )
    }

    case 'image': {
      const src = properties?.source?.[0]?.[0] || format?.display_source
      const caption = getTextContent(properties?.caption)
      if (!src) return null
      return (
        <figure className="my-8 -mx-4 sm:mx-0">
          <img src={src} alt={caption || ''} loading="lazy" className="w-full block" />
          {caption && (
            <figcaption className="text-center text-xs text-mute mt-2 font-mono tracking-wide">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'quote':
      return (
        <blockquote className="border-l-2 border-accent/60 pl-5 my-6 font-display italic text-[17px] text-ink/90 leading-[1.6]">
          <RichText decorations={properties?.title} />
        </blockquote>
      )

    case 'callout': {
      const icon = format?.page_icon || ''
      return (
        <div className="flex gap-3 bg-paperAlt/50 border border-rule p-4 my-6">
          {icon && <span className="text-base shrink-0">{icon}</span>}
          <div className="text-ink leading-relaxed font-display text-[16px]">
            <RichText decorations={properties?.title} />
          </div>
        </div>
      )
    }

    case 'divider':
      return <hr className="my-10" />

    case 'bookmark': {
      const link = properties?.link?.[0]?.[0]
      const title = getTextContent(properties?.title) || link
      if (!link) return null
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-rule p-4 my-4 hover:bg-paperAlt/50 transition-colors"
        >
          <span className="text-ink text-sm">{title}</span>
          <span className="block text-mute text-xs mt-1 truncate font-mono">{link}</span>
        </a>
      )
    }

    default:
      return null
  }
}

export function NotionBlocks({
  blockIds,
  recordMap,
}: {
  blockIds: string[]
  recordMap: ExtendedRecordMap
}) {
  const elements: React.ReactNode[] = []
  let listItems: React.ReactNode[] = []
  let listType: 'bulleted_list' | 'numbered_list' | null = null

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listType === 'numbered_list' ? 'ol' : 'ul'
      const listClass =
        listType === 'numbered_list'
          ? 'list-decimal pl-6 my-4 space-y-1'
          : 'list-disc pl-6 my-4 space-y-1'
      elements.push(
        <Tag key={`list-${elements.length}`} className={listClass}>
          {listItems}
        </Tag>
      )
      listItems = []
      listType = null
    }
  }

  for (const blockId of blockIds) {
    const entry = recordMap.block[blockId] as any
    if (!entry) continue
    const first = entry.value ?? entry
    const blockValue = (
      first && typeof first === 'object' && 'value' in first && !('type' in first)
        ? first.value
        : first
    ) as Block | undefined
    if (!blockValue) continue

    const { type } = blockValue

    if (type === 'bulleted_list' || type === 'numbered_list') {
      if (listType && listType !== type) {
        flushList()
      }
      listType = type
      listItems.push(
        <NotionBlock key={blockId} block={blockValue} recordMap={recordMap} />
      )
    } else {
      flushList()
      elements.push(
        <NotionBlock key={blockId} block={blockValue} recordMap={recordMap} />
      )
    }
  }

  flushList()
  return <>{elements}</>
}
