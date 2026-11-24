import { LoaderCircle } from 'lucide-react'
import Container from './Container'

export function LoadingState({ label = 'Loading…' }) {
  return (
    <Container className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <LoaderCircle className="size-7 animate-spin text-brand-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-brand-navy/60">{label}</p>
    </Container>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Container className="py-16">
      <div className="surface-blue flex flex-col items-center px-6 py-14 text-center">
        {Icon && (
          <span className="grid size-14 place-items-center rounded-full bg-brand-light text-brand-primary">
            <Icon className="size-6" aria-hidden="true" />
          </span>
        )}
        <h2 className="mt-5 text-xl font-bold text-brand-navy">{title}</h2>
        {description && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-navy/60">
            {description}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </Container>
  )
}

export function ErrorState({ message, action }) {
  return (
    <EmptyState
      title="Something went wrong"
      description={message ?? 'Please try again shortly.'}
      action={action}
    />
  )
}
