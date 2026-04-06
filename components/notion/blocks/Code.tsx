export function Code({ block }: { block: any }) {
  const code = block.code.rich_text.map((t: any) => t.plain_text).join('')
  const language = block.code.language ?? 'plain text'

  return (
    <pre className="my-6 overflow-x-auto rounded-none border border-neutral-800 bg-neutral-900 p-4">
      <code className="text-sm font-mono text-neutral-300 leading-relaxed">
        {code}
      </code>
    </pre>
  )
}
