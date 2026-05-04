import Link from 'next/link'

export function Nav() {
  return (
    <header className="flex justify-between items-baseline mb-12 border-b border-rule pb-3.5">
      <Link
        href="/"
        className="font-display text-xl font-medium tracking-tight text-ink"
      >
        xikai.me
      </Link>
      <nav className="flex gap-5 text-[13px] text-mute">
        <Link href="/#about" className="hover:text-ink transition-colors">About</Link>
        <Link href="/#highlights" className="hover:text-ink transition-colors">Highlights</Link>
        <Link href="/#photos" className="hover:text-ink transition-colors">Photographs</Link>
        <Link href="/#writing" className="hover:text-ink transition-colors">Writing</Link>
        <Link href="/#work" className="hover:text-ink transition-colors">Projects</Link>
      </nav>
    </header>
  )
}
