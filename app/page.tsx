import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getBlogPosts, getProjects, getPhotos } from '@/lib/notion'
import { siteConfig } from '@/lib/config'

const HeroScene = dynamic(
  () => import('@/components/shader/HeroScene').then(m => m.HeroScene),
  { ssr: false }
)
const LiquidGlassInit = dynamic(
  () => import('@/components/ui/LiquidGlassInit').then(m => m.LiquidGlassInit),
  { ssr: false }
)

export const revalidate = 60

export default async function Home() {
  const [posts, projects, photos] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getPhotos(),
  ])

  return (
    <main className="relative">
      <HeroScene />
      <LiquidGlassInit />

      {/* ── Floating Glass Nav ── */}
      {/* One glass element: navigation pill, fixed to top on scroll */}
      <div className="sticky top-6 z-50 flex justify-center px-4" data-liquid-ignore>
        <nav
          className="glass-nav inline-flex items-center gap-6 px-8 py-3 rounded-full"
          style={{ position: 'relative', zIndex: 50 }}
        >
          <div className="relative flex items-center gap-6" style={{ zIndex: 51 }}>
            <a href="#top" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
              xikai()
            </a>
            <span className="w-px h-4 bg-white/10" />
            <a href="#writing" className="text-sm text-white/60 hover:text-white/90 transition-colors">writing</a>
            <a href="#projects" className="text-sm text-white/60 hover:text-white/90 transition-colors">projects</a>
            <a href="#photos" className="text-sm text-white/60 hover:text-white/90 transition-colors">photos</a>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section id="top" className="flex flex-col items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-5">
            hi, i&apos;m xikai
          </h1>
          <p className="text-lg text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
            software engineer at apple.<br />
            i build things out of curiosity.
          </p>
          <div className="flex justify-center gap-8 text-sm text-white/40">
            <a href={`https://github.com/${siteConfig.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">GitHub</a>
            <a href={`https://www.linkedin.com/in/${siteConfig.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">LinkedIn</a>
            <a href="mailto:realxikai@gmail.com" className="hover:text-white/80 transition-colors">Email</a>
          </div>
        </div>
      </section>

      {/* ── Writing ── content directly on background, no glass */}
      {posts.length > 0 && (
        <section id="writing" className="mx-auto max-w-2xl px-6 py-32">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-10">Writing</h2>
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/writing/${post.slug}`}
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <span className="text-white/80 group-hover:text-white transition-colors">{post.title}</span>
                {post.published && (
                  <span className="shrink-0 text-xs text-white/25 tabular-nums">
                    {new Date(post.published).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Projects ── content directly on background */}
      {projects.length > 0 && (
        <section id="projects" className="mx-auto max-w-4xl px-6 py-32">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-10">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-lg overflow-hidden">
            {projects.map((project, i) => {
              const Tag = project.url ? 'a' : 'div'
              const props = project.url ? { href: project.url, target: '_blank' as const, rel: 'noopener noreferrer' } : {}
              return (
                <Tag
                  key={i}
                  {...props}
                  className="group bg-black/60 p-6 hover:bg-black/40 transition-colors"
                >
                  <h3 className="text-white/80 text-sm font-medium mb-1 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-white/30 leading-relaxed">{project.description}</p>
                  )}
                </Tag>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Photos ── content directly on background */}
      {photos.length > 0 && (
        <section id="photos" className="mx-auto max-w-5xl px-6 py-32">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-10">Photos</h2>
          <div className="columns-2 md:columns-3 gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full rounded-sm"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="py-20 text-center text-xs text-white/15">
        xikai() · {new Date().getFullYear()}
      </footer>
    </main>
  )
}
