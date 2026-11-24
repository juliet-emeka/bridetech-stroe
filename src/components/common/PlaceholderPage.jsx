import { Container } from '../common'

export default function PlaceholderPage({ title, description }) {
  return (
    <Container className="py-16 sm:py-24">
      <div className="surface overflow-hidden">
        <div className="h-2 bg-brand-gradient" />
        <div className="p-8 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
            Foundation preview
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-navy/60">
            {description}
          </p>
        </div>
      </div>
    </Container>
  )
}
