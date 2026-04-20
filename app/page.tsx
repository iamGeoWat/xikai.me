import Link from 'next/link'
import { getBlogPosts, getProjects } from '@/lib/notion'
import { getUnsplashPhotos } from '@/lib/unsplash'
import { siteConfig } from '@/lib/site-config'
import { fmtDateShort } from '@/lib/format'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Section } from '@/components/section'

export const revalidate = 60

export default async function Home() {
  const [posts, projects, photos] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getUnsplashPhotos(12),
  ])

  return (
    <div className="max-w-reading mx-auto px-10 pt-14 pb-20">
      <Nav />

      {/* Hero */}
      <div className="mb-14">
        <h1 className="font-display text-[52px] font-normal leading-[1.05] tracking-tight m-0 text-balance">
          Hi, I&rsquo;m Xikai.
        </h1>
      </div>

      {/* ABOUT */}
      <Section id="about" kicker="§ 01" title="About" sprite="cat">
        <div className="mt-2">
          <p className="text-base leading-relaxed text-ink text-pretty">
            I&rsquo;m Xikai Liu. I work on App Store Frameworks at Apple, live in the Bay Area,
            take photos, poke at side projects, and care about creating and exploring things.
          </p>
        </div>

        {/* contacts */}
        <div className="mt-8 pt-[18px] border-t border-rule grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href={`https://github.com/${siteConfig.social.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink no-underline"
          >
            <div className="font-mono text-[10px] text-mute uppercase tracking-wider mb-1">
              GitHub
            </div>
            <div className="text-sm">@{siteConfig.social.github}</div>
          </a>
          <a
            href={`https://linkedin.com/in/${siteConfig.social.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink no-underline"
          >
            <div className="font-mono text-[10px] text-mute uppercase tracking-wider mb-1">
              LinkedIn
            </div>
            <div className="text-sm">/{siteConfig.social.linkedin}</div>
          </a>
          <a
            href="https://unsplash.com/@shekai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink no-underline"
          >
            <div className="font-mono text-[10px] text-mute uppercase tracking-wider mb-1">
              Unsplash
            </div>
            <div className="text-sm">@shekai</div>
          </a>
          <a
            href={`mailto:${siteConfig.social.email}`}
            className="text-ink no-underline"
          >
            <div className="font-mono text-[10px] text-mute uppercase tracking-wider mb-1">
              Email
            </div>
            <div className="text-sm">{siteConfig.social.email}</div>
          </a>
        </div>
      </Section>

      {/* HIGHLIGHTS */}
      <Section id="highlights" kicker="§ 02" title="Highlights" sprite="ghost">
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              href: 'https://oslab.xikai.me',
              title: 'oslab',
              domain: 'oslab.xikai.me',
              blurb:
                'Interactive simulations to help you understand how operating systems schedule processes and manage memory.',
            },
            {
              href: 'https://leica.xikai.me',
              title: 'leica',
              domain: 'leica.xikai.me',
              blurb:
                'Discover the history of your Leica camera. Enter your serial number to uncover the model, year of production, and manufacturing details from our database.',
            },
          ].map((item) => (
            <a
              key={item.domain}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-rule p-5 bg-paperAlt/30 hover:bg-paperAlt/70 hover:border-ink/30 transition-colors group"
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-display text-[22px] font-medium text-ink">
                  {item.title}
                </span>
                <span className="font-mono text-[10px] text-mute uppercase tracking-wider group-hover:text-accent transition-colors">
                  Visit &rarr;
                </span>
              </div>
              <p className="text-sm text-mute leading-relaxed text-pretty mb-3">
                {item.blurb}
              </p>
              <div className="font-mono text-[11px] text-mute tracking-wide">
                {item.domain}
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* PHOTOS */}
      <Section id="photos" kicker="§ 03" title="Photographs" sprite="bird">
        {photos.length > 0 ? (
          <>
            <div className="mt-2 columns-3 gap-2">
              {photos.map((photo, i) => (
                <a
                  key={i}
                  href={photo.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 break-inside-avoid overflow-hidden block"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full block"
                  />
                </a>
              ))}
            </div>
            <div className="mt-5 text-sm text-mute flex justify-between items-center">
              <span>Latest {photos.length} frames</span>
              <a
                href="https://unsplash.com/@shekai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-[3px]"
              >
                See full archive on Unsplash &rarr;
              </a>
            </div>
          </>
        ) : (
          <div className="mt-6 p-6 border border-rule text-sm text-mute font-mono">
            Photos will appear here once <code className="text-ink">UNSPLASH_ACCESS_KEY</code> is set.
          </div>
        )}
      </Section>

      {/* WRITING */}
      <Section id="writing" kicker="§ 04" title="Writing" sprite="buddy">
        <div className="mt-2">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/articles/${post.slug}`}
              className={`grid grid-cols-[90px_1fr_auto] gap-5 py-[18px] border-t border-rule items-baseline text-ink no-underline hover:bg-paperAlt/40 transition-colors ${
                i === posts.length - 1 ? 'border-b border-rule' : ''
              }`}
            >
              <div className="font-mono text-[11px] text-mute uppercase tracking-wide pt-1">
                {fmtDateShort(post.published)}
              </div>
              <div>
                <div className="font-display text-[19px] font-medium tracking-tight mb-1">
                  {post.title}
                </div>
                <div className="text-sm text-mute leading-relaxed text-pretty">
                  {post.description}
                </div>
              </div>
              <div className="font-mono text-[10px] text-mute uppercase tracking-wider whitespace-nowrap pt-1.5">
                {post.tags[0] || 'note'}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* HOBBY PROJECTS */}
      <Section id="work" kicker="§ 05" title="Hobby projects" sprite="mush">
        <div className="mt-2 grid gap-0.5">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.url || '#'}
              target={project.url ? '_blank' : undefined}
              rel={project.url ? 'noopener noreferrer' : undefined}
              className="grid grid-cols-[1fr_auto] gap-4 py-4 px-1 border-t border-rule text-ink no-underline items-baseline hover:bg-paperAlt/40 transition-colors"
            >
              <div>
                <span className="font-mono text-sm font-medium text-accent">
                  {project.title}
                </span>
                {project.description && (
                  <span className="text-sm text-ink ml-3">{project.description}</span>
                )}
              </div>
              {project.url && (
                <div className="font-mono text-xs text-mute tracking-wide whitespace-nowrap">
                  {(() => {
                    try {
                      return new URL(project.url).hostname.replace('www.', '') + ' →'
                    } catch {
                      return '→'
                    }
                  })()}
                </div>
              )}
            </a>
          ))}
        </div>
      </Section>

      <Footer />
    </div>
  )
}
