interface ProjectCardProps {
  title: string
  description: string
  url: string | null
}

export function ProjectCard({ title, description, url }: ProjectCardProps) {
  const Wrapper = url ? 'a' : 'div'
  const linkProps = url
    ? { href: url, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...linkProps}
      className="group block border border-neutral-800 p-6 hover:-translate-y-0.5 hover:border-neutral-600 transition-all duration-200"
    >
      <h3 className="text-fg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </Wrapper>
  )
}
