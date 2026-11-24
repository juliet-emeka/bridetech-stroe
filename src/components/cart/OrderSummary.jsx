import { Info } from 'lucide-react'
import { formatCurrency } from '../../services/catalogue'

export default function OrderSummary({
  subtotal,
  itemCount,
  children,
  note = 'Delivery information and final total will be confirmed by the store before dispatch.',
}) {
  return (
    <div className="surface-blue p-5 sm:p-6">
      <h2 className="text-lg font-bold text-brand-navy">Order summary</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between text-brand-navy/70">
          <dt>Items ({itemCount})</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-brand-navy/70">
          <dt>Delivery</dt>
          <dd>To be confirmed</dd>
        </div>
        <div className="flex justify-between border-t border-brand-light pt-4 text-base font-extrabold text-brand-navy">
          <dt>Order total</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
      </dl>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-brand-navy/55">
        <Info className="mt-0.5 size-4 shrink-0 text-brand-primary" aria-hidden="true" />
        {note}
      </p>

      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
