import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-xl leading-relaxed mb-6">
          Software engineer at Apple. Previously TikTok, Meituan.
        </p>
        <p className="text-xl leading-relaxed mb-6">
          Two-time Apple WWDC Swift Student Challenge winner.
        </p>
        <p className="text-xl leading-relaxed mb-12">
          I build things with code.
        </p>
        <div className="flex justify-center gap-6 text-muted">
          <a
            href="https://github.com/iamGeoWat"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg transition-colors"
          >
            GitHub
          </a>
          <span className="text-neutral-700">&middot;</span>
          <a
            href="https://www.linkedin.com/in/xikai-liu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-neutral-700">&middot;</span>
          <a
            href="mailto:realxikai@gmail.com"
            className="hover:text-fg transition-colors"
          >
            Email
          </a>
        </div>
      </div>

      <Link
        href="/"
        className="fixed bottom-8 text-muted hover:text-fg transition-colors text-sm"
      >
        &larr; xikai()
      </Link>
    </main>
  )
}
