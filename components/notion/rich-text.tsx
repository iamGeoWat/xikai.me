import React from 'react'
import type { Decoration, ExtendedRecordMap } from 'notion-types'

function unwrapBlock(entry: any): any {
  if (!entry) return undefined
  const first = entry.value ?? entry
  if (
    first &&
    typeof first === 'object' &&
    'value' in first &&
    !('type' in first) &&
    !('schema' in first)
  ) {
    return first.value
  }
  return first
}

function pageTitleFromRecordMap(recordMap: ExtendedRecordMap | undefined, pageId: string): string {
  if (!recordMap) return ''
  const block = unwrapBlock(recordMap.block?.[pageId])
  const titleDecorations = block?.properties?.title
  if (!Array.isArray(titleDecorations)) return ''
  return titleDecorations.map((d: any) => d?.[0] ?? '').join('')
}

export function RichText({
  decorations,
  recordMap,
}: {
  decorations?: Decoration[]
  recordMap?: ExtendedRecordMap
}) {
  if (!decorations) return null

  return (
    <>
      {decorations.map((decoration, i) => {
        let [text, formats] = decoration
        if (!text) return null

        // Page mention placeholder: replace '‣' with the actual page title before formatting passes
        if (formats) {
          const pageMention = formats.find((f) => f[0] === 'p')
          if (pageMention) {
            const pageId = pageMention[1] as string
            const title = pageTitleFromRecordMap(recordMap, pageId)
            if (title) text = title
            else if (text === '‣' || text === '‣') text = '↗ linked page'
          }
        }

        let element: React.ReactNode = text

        if (formats) {
          for (const format of formats) {
            const type = format[0]

            switch (type) {
              case 'p': {
                const pageId = format[1] as string
                const noDash = pageId.replace(/-/g, '')
                const href = `https://www.notion.so/${noDash}`
                element = (
                  <a
                    key={`p-${i}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-mute/40 underline-offset-[3px] hover:decoration-ink transition-colors"
                  >
                    {element}
                  </a>
                )
                break
              }
              case 'b':
                element = <strong key={`b-${i}`} className="font-medium">{element}</strong>
                break
              case 'i':
                element = <em key={`i-${i}`} className="italic">{element}</em>
                break
              case 's':
                element = <s key={`s-${i}`}>{element}</s>
                break
              case '_':
                element = <span key={`u-${i}`} className="underline underline-offset-2">{element}</span>
                break
              case 'c':
                element = (
                  <code
                    key={`c-${i}`}
                    className="bg-paperAlt/60 border border-rule px-1.5 py-0.5 text-[0.9em] font-mono"
                  >
                    {element}
                  </code>
                )
                break
              case 'a': {
                const href = format[1] as string
                element = (
                  <a
                    key={`a-${i}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-mute/40 underline-offset-[3px] hover:decoration-ink transition-colors"
                  >
                    {element}
                  </a>
                )
                break
              }
              case 'h': {
                const color = format[1] as string
                if (color?.includes('_background')) {
                  element = (
                    <span key={`h-${i}`} className="bg-paperAlt/80 px-0.5">
                      {element}
                    </span>
                  )
                }
                break
              }
            }
          }
        }

        return <React.Fragment key={i}>{element}</React.Fragment>
      })}
    </>
  )
}
