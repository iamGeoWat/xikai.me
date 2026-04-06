import { getProjects } from '@/lib/notion'
import { ProjectCard } from '@/components/ui/ProjectCard'
import Link from 'next/link'

export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="mx-auto max-w-grid px-6 py-24">
      <Link href="/" className="text-muted hover:text-fg transition-colors text-sm mb-16 block">
        &larr; xikai()
      </Link>

      <h1 className="text-3xl font-light tracking-tight mb-12">projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={i} {...project} />
        ))}
      </div>
    </main>
  )
}
