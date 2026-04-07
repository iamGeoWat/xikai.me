const WORDS = [
  { text: 'code', x: '8%', y: '15%', size: '12vw', rotate: -12 },
  { text: 'curiosity', x: '55%', y: '70%', size: '10vw', rotate: 8 },
  { text: 'build', x: '70%', y: '20%', size: '9vw', rotate: -5 },
  { text: 'xikai', x: '15%', y: '75%', size: '14vw', rotate: 15 },
  { text: 'WWDC', x: '80%', y: '50%', size: '8vw', rotate: -18 },
  { text: '∞', x: '40%', y: '85%', size: '11vw', rotate: 3 },
]

export function ScatteredWords() {
  return (
    <div
      className="absolute inset-0 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      {WORDS.map((word, i) => (
        <span
          key={i}
          className="absolute font-sans font-bold text-fg whitespace-nowrap"
          style={{
            left: word.x,
            top: word.y,
            fontSize: word.size,
            transform: `rotate(${word.rotate}deg)`,
            opacity: 0.03,
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}
