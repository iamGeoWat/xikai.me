import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-reading space-y-4 text-center text-xl leading-relaxed">
        <p>Software engineer at Apple. Previously TikTok, Meituan.</p>
        <p>Two-time Apple WWDC Swift Student Challenge winner.</p>
        <p>I build things with code.</p>
      </div>

      <div className="mt-10 flex gap-3 text-sm text-muted">
        <a
          href={`https://github.com/${siteConfig.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-fg"
        >
          GitHub
        </a>
        <span>&middot;</span>
        <a
          href={`https://linkedin.com/in/${siteConfig.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-fg"
        >
          LinkedIn
        </a>
        <span>&middot;</span>
        <a
          href="mailto:hi@xikai.me"
          className="transition-colors hover:text-fg"
        >
          Email
        </a>
      </div>

      <Link
        href="/"
        className="fixed bottom-8 text-sm text-muted transition-colors hover:text-fg"
      >
        &larr; xikai()
      </Link>
    </main>
  )
}
