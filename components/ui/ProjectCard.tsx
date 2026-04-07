function CardContent({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <>
      <h2 className="mb-2 text-lg font-medium text-fg">{title}</h2>
      {description && (
        <p className="text-sm leading-relaxed text-muted">{description}</p>
      )}
    </>
  )
}

export function ProjectCard({
  title,
  description,
  url,
}: {
  title: string
  description: string
  url: string | null
}) {
  const classes =
    'block rounded-lg border border-neutral-800 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-600'

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={classes}>
        <CardContent title={title} description={description} />
      </a>
    )
  }

  return (
    <div className={classes}>
      <CardContent title={title} description={description} />
    </div>
  )
}
