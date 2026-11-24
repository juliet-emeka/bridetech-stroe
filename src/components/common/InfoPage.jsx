import Container from './Container'
import SectionHeading from './SectionHeading'

export default function InfoPage({ eyebrow, title, description, children }) {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10 max-w-3xl space-y-6 text-sm leading-relaxed text-brand-navy/75">
        {children}
      </div>
    </Container>
  )
}

export function InfoSection({ title, children }) {
  return (
    <section className="surface-blue p-6 sm:p-7">
      <h2 className="text-base font-bold text-brand-navy">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}
