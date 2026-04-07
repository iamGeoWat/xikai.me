import dynamic from 'next/dynamic'
import { getBlogPosts, getProjects, getPhotos } from '@/lib/notion'
import { siteConfig } from '@/lib/config'

const HeroScene = dynamic(
  () => import('@/components/shader/HeroScene').then((m) => m.HeroScene),
  { ssr: false },
)

export const revalidate = 60

function formatShortDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function Home() {
  const [posts, projects, photos] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getPhotos(),
  ])

  return (
    <main>
      {/* Hero */}
      <section className="relative flex h-screen flex-col items-center justify-center">
        <HeroScene />
        <h1 className="text-5xl font-light tracking-tight mb-12">xikai()</h1>
        <nav className="flex gap-8">
          {['writing', 'projects', 'photos', 'about'].map((id, i) => (
            <span key={id} className="flex gap-8 items-center">
              {i > 0 && <span className="text-neutral-700">·</span>}
              <a
                href={`#${id}`}
                className="text-muted hover:text-fg transition-colors duration-300 text-lg tracking-wide"
              >
                {id}
              </a>
            </span>
          ))}
        </nav>
      </section>

      {/* Writing */}
      <section id="writing" className="mx-auto max-w-reading px-6 py-32">
        <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">writing</h2>
        <div className="flex flex-col">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/writing/${post.slug}`}
              className="flex items-baseline justify-between gap-4 border-b border-neutral-800/50 py-3 text-fg/80 transition-colors duration-200 hover:text-white"
            >
              <span className="font-serif text-base">{post.title}</span>
              <span className="shrink-0 text-sm text-muted">{formatShortDate(post.published)}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-grid px-6 py-32">
        <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => {
            const classes = 'block border border-neutral-800 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-600'
            return project.url ? (
              <a key={i} href={project.url} target="_blank" rel="noopener noreferrer" className={classes}>
                <h3 className="mb-2 text-lg font-medium text-fg">{project.title}</h3>
                {project.description && <p className="text-sm leading-relaxed text-muted">{project.description}</p>}
              </a>
            ) : (
              <div key={i} className={classes}>
                <h3 className="mb-2 text-lg font-medium text-fg">{project.title}</h3>
                {project.description && <p className="text-sm leading-relaxed text-muted">{project.description}</p>}
              </div>
            )
          })}
        </div>
      </section>

      {/* Photos */}
      <section id="photos" className="mx-auto max-w-4xl px-6 py-32">
        <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">photos</h2>
        <div className="space-y-16">
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo.src}
              alt={photo.alt}
              className="w-full"
              loading="lazy"
            />
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-32">
        <div className="max-w-lg text-center">
          <p className="text-xl leading-relaxed mb-4">
            Software engineer at Apple. Previously TikTok, Meituan.
          </p>
          <p className="text-xl leading-relaxed mb-4">
            Two-time Apple WWDC Swift Student Challenge winner.
          </p>
          <p className="text-xl leading-relaxed mb-10">
            I build things with code.
          </p>
          <div className="flex justify-center gap-6 text-muted">
            <a href={`https://github.com/${siteConfig.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">GitHub</a>
            <span className="text-neutral-700">·</span>
            <a href={`https://www.linkedin.com/in/${siteConfig.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">LinkedIn</a>
            <span className="text-neutral-700">·</span>
            <a href="mailto:realxikai@gmail.com" className="hover:text-fg transition-colors">Email</a>
          </div>
        </div>
      </section>
    </main>
  )
}
