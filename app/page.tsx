import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getBlogPosts, getProjects, getPhotos } from '@/lib/notion'
import { siteConfig } from '@/lib/config'

const HeroScene = dynamic(
  () => import('@/components/shader/HeroScene').then((m) => m.HeroScene),
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
    <main>
      {/* Hero */}
      <section className="relative flex h-screen flex-col items-center justify-center px-6">
        <HeroScene />
        <div className="text-center z-10">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            hi, i'm xikai
          </h1>
          <p className="text-lg text-muted max-w-md mx-auto mb-8">
            software engineer, building things out of curiosity.
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted">
            <a href={`https://github.com/${siteConfig.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">GitHub</a>
            <a href={`https://www.linkedin.com/in/${siteConfig.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">LinkedIn</a>
            <a href="mailto:realxikai@gmail.com" className="hover:text-fg transition-colors">Email</a>
          </div>
        </div>
        <div className="absolute bottom-8 text-muted/40 text-xs tracking-widest animate-pulse">
          scroll
        </div>
      </section>

      {/* Writing */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-reading px-6 py-24">
          <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">writing</h2>
          <div className="flex flex-col">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/writing/${post.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3 border-b border-neutral-800/50"
              >
                <span className="text-fg group-hover:text-white transition-colors">{post.title}</span>
                {post.published && (
                  <span className="shrink-0 text-sm text-muted tabular-nums">
                    {new Date(post.published).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-grid px-6 py-24">
          <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => {
              const Tag = project.url ? 'a' : 'div'
              const linkProps = project.url ? { href: project.url, target: '_blank' as const, rel: 'noopener noreferrer' } : {}
              return (
                <Tag key={i} {...linkProps} className="group block border border-neutral-800 p-6 hover:-translate-y-0.5 hover:border-neutral-600 transition-all duration-200">
                  <h3 className="text-fg font-medium mb-2">{project.title}</h3>
                  {project.description && <p className="text-sm text-muted leading-relaxed">{project.description}</p>}
                </Tag>
              )
            })}
          </div>
        </section>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-24">
          <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">photos</h2>
          <div className="columns-2 gap-4">
            {photos.map((photo, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <img src={photo.src} alt={photo.alt} className="w-full" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 text-center text-sm text-muted/50">
        xikai()
      </footer>
    </main>
  )
}
