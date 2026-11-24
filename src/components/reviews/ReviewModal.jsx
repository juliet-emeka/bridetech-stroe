import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { Button } from '../common'
import { submitReview } from '../../services/reviews'
import ReviewForm from './ReviewForm'

export default function ReviewModal({ items, defaultName = '', onClose }) {
  const [selectedId, setSelectedId] = useState(() => items?.[0]?.id ?? '')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!items?.length) return null

  const selected = items.find((item) => item.id === selectedId) ?? items[0]

  const handleSubmit = async (values) => {
    await submitReview({ productId: selected.id, ...values })
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-brand-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close review popup"
          className="absolute right-4 top-4 rounded-full p-2 text-brand-navy/50 transition hover:bg-brand-light hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-12 text-brand-primary" aria-hidden="true" />
            <h2 id="review-modal-title" className="mt-4 text-2xl font-extrabold text-brand-navy">
              Thanks for your review
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-navy/65">
              Your review has been submitted. It will appear on the product page
              after the store approves it.
            </p>
            <Button className="mt-6" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
              Order received
            </p>
            <h2 id="review-modal-title" className="mt-2 pr-8 text-2xl font-extrabold text-brand-navy">
              Rate your purchase
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-navy/65">
              Share a quick rating and comment. Your review will be checked by
              the store before it appears publicly.
            </p>

            {items.length > 1 && (
              <div className="mt-5">
                <label
                  htmlFor="review-product"
                  className="mb-1.5 block text-sm font-semibold text-brand-navy"
                >
                  Product
                </label>
                <select
                  id="review-product"
                  value={selected.id}
                  onChange={(event) => {
                    setSelectedId(event.target.value)
                    setDone(false)
                  }}
                  className="h-11 w-full rounded-xl border border-brand-light bg-brand-white px-3.5 text-sm text-brand-navy outline-none focus:border-brand-primary"
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-5">
              <ReviewForm
                key={selected.id}
                defaultName={defaultName}
                productName={selected.name}
                onSubmit={handleSubmit}
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 text-sm font-semibold text-brand-navy/55 hover:text-brand-navy"
            >
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  )
}
