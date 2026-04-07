const SYMBOLS = [
  // Code
  '{}', '=>', '//', '&&', '||', '0x', 'fn', '++', '!=', '<<', '::', '[]', '()', '**',
  // Math
  '∑', '∂', '∫', 'π', '∞', 'Δ', 'λ', 'Ω', '√', '≈', '∈', '⊂',
  // Unicode blocks
  '░', '▓', '█', '◆', '●', '○', '◈', '▪', '▫', '◇', '△', '▽',
  // Emoji/symbols
  '📷', '🍎', '⌘', '✦', '⚡', '◎', '❋', '※',
  // Fragments
  'let', 'nil', 'pub', 'use', 'mut', 'def', 'new', 'var', 'async', 'self',
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function SymbolMatrix() {
  const cells: { symbol: string; opacity: number; size: string; rotate: number }[] = []

  for (let i = 0; i < 400; i++) {
    const r1 = seededRandom(i * 7 + 1)
    const r2 = seededRandom(i * 13 + 2)
    const r3 = seededRandom(i * 19 + 3)
    const r4 = seededRandom(i * 31 + 4)

    cells.push({
      symbol: SYMBOLS[Math.floor(r1 * SYMBOLS.length)],
      opacity: 0.04 + r2 * 0.08,
      size: `${0.55 + r3 * 0.7}rem`,
      rotate: -8 + r4 * 16,
    })
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden font-mono text-fg select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="grid grid-cols-[repeat(20,1fr)] gap-0 w-full h-full place-items-center">
        {cells.map((cell, i) => (
          <span
            key={i}
            style={{
              opacity: cell.opacity,
              fontSize: cell.size,
              transform: `rotate(${cell.rotate}deg)`,
            }}
          >
            {cell.symbol}
          </span>
        ))}
      </div>
    </div>
  )
}
