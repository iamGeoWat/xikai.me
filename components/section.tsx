import { PixelSprite } from './pixel-sprite'

interface SectionProps {
  id: string
  kicker: string
  title: string
  sprite?: 'buddy' | 'ghost' | 'bird' | 'cat' | 'mush'
  children: React.ReactNode
}

export function Section({ id, kicker, title, sprite, children }: SectionProps) {
  return (
    <section id={id} className="my-20">
      <div className="flex items-baseline gap-3.5 mb-5">
        <span className="font-mono text-[11px] text-accent uppercase tracking-wider">
          {kicker}
        </span>
        <h2 className="font-display text-3xl font-normal tracking-tight m-0">
          {title}
        </h2>
        {sprite && (
          <span className="ml-auto">
            <PixelSprite name={sprite} size={3} color="#c05440" />
          </span>
        )}
      </div>
      {children}
    </section>
  )
}
