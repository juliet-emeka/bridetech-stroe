export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className = '',
}) {
  const centered = align === 'center'

  return (
    <div
      className={`${centered ? 'mx-auto max-w-2xl text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
          <span className="h-px w-6 bg-brand-primary" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-brand-navy/60">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
