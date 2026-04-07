import React from 'react'

interface RichTextItem {
  type: string
  plain_text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
  }
}

export function renderRichText(richTexts: RichTextItem[] | undefined) {
  if (!richTexts || richTexts.length === 0) return null

  return richTexts.map((rt, i) => {
    let el: React.ReactNode = rt.plain_text

    if (rt.annotations.code) {
      el = (
        <code
          key={`code-${i}`}
          className="rounded-none bg-neutral-800 px-1.5 py-0.5 font-mono text-sm text-fg"
        >
          {el}
        </code>
      )
    }

    if (rt.annotations.bold) {
      el = (
        <strong key={`bold-${i}`} className="font-semibold">
          {el}
        </strong>
      )
    }

    if (rt.annotations.italic) {
      el = <em key={`italic-${i}`}>{el}</em>
    }

    if (rt.annotations.strikethrough) {
      el = <s key={`strike-${i}`}>{el}</s>
    }

    if (rt.annotations.underline) {
      el = (
        <span key={`underline-${i}`} className="underline">
          {el}
        </span>
      )
    }

    if (rt.href) {
      el = (
        <a
          key={`link-${i}`}
          href={rt.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-muted/50 transition-colors duration-200 hover:border-fg"
        >
          {el}
        </a>
      )
    }

    return <React.Fragment key={i}>{el}</React.Fragment>
  })
}
