import Link from 'next/link'
import { getProjects } from '@/lib/notion'
import { ProjectCard } from '@/components/ui/ProjectCard'

export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="mx-auto max-w-grid px-6 py-20">
      <Link
        href="/"
        className="mb-12 inline-block text-sm text-muted transition-colors hover:text-fg"
      >
        &larr; xikai()
      </Link>
      <h1 className="mb-10 text-3xl font-light tracking-tight">projects</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            url={project.url}
          />
        ))}
      </div>
    </main>
  )
}
