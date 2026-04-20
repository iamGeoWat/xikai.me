import React from 'react'
import type { Decoration } from 'notion-types'

export function RichText({ decorations }: { decorations?: Decoration[] }) {
  if (!decorations) return null

  return (
    <>
      {decorations.map((decoration, i) => {
        const [text, formats] = decoration
        if (!text) return null

        let element: React.ReactNode = text

        if (formats) {
          for (const format of formats) {
            const type = format[0]

            switch (type) {
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
