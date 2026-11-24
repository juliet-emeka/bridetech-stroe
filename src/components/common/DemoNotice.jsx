import { Info } from 'lucide-react'
import { isDemoCatalogue } from '../../services/catalogue'

export default function DemoNotice() {
  if (!isDemoCatalogue) return null

  return (
    <div className="border-b border-brand-primary/10 bg-brand-light/60">
      <div className="mx-auto flex max-w-7xl items-start gap-2.5 px-4 py-2.5 text-xs text-brand-deep sm:px-6 lg:px-8">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          Demo catalogue: listings, prices and availability below are samples for
          development only. The store administrator will supply real products.
        </p>
      </div>
    </div>
  )
}
