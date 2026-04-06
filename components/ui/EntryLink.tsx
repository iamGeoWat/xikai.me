import Link from 'next/link'

export function EntryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-muted hover:text-fg transition-colors duration-300 text-lg tracking-wide"
    >
      {children}
    </Link>
  )
}
