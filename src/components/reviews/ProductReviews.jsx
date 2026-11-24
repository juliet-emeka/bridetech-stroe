import { useCallback, useState } from 'react'
import { PenLine } from 'lucide-react'
import { Button, LoadingState } from '../common'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { listApprovedReviews, submitReview } from '../../services/reviews'
import ReviewForm from './ReviewForm'
import StarRating from './StarRating'

const formatReviewDate = (value) =>
  new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
  }).format(new Date(value))

export default function ProductReviews({ product }) {
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState('')
  const loader = useCallback(
    () => listApprovedReviews(product.id),
    [product.id],
  )
  const reviews = useAsyncResource(loader, `product-reviews-${product.id}`)
  const list = reviews.data ?? []
  const average = list.length
    ? list.reduce((sum, review) => sum + review.rating, 0) / list.length
    : 0

  const handleSubmit = async (values) => {
    await submitReview({ productId: product.id, ...values })
    setShowForm(false)
    setNotice(
      'Thank you! Your review was submitted.',
    )
  }

  return (
    <section
      className="mt-16 border-t border-brand-light pt-12"
      aria-labelledby="reviews-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
            Customer feedback
          </p>
          <h2
            id="reviews-heading"
            className="mt-1 text-2xl font-extrabold text-brand-navy"
          >
            Reviews
          </h2>
        </div>
        {!showForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowForm(true)
              setNotice('')
            }}
          >
            <PenLine className="size-4" aria-hidden="true" />
            Write a review
          </Button>
        )}
      </div>

      {notice && (
        <p role="status" className="mt-5 rounded-xl bg-brand-light p-3 text-sm text-brand-deep">
          {notice}
        </p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
        <div className="surface p-5">
          {list.length ? (
            <>
              <p className="text-4xl font-extrabold text-brand-navy">
                {average.toFixed(1)}
              </p>
              <StarRating
                value={Math.round(average)}
                size="md"
                className="mt-2"
              />
              <p className="mt-2 text-xs text-brand-navy/55">
                Based on {list.length} approved review
                {list.length === 1 ? '' : 's'}
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-brand-navy/60">
              No approved reviews yet. Be the first to share your experience
              with this product.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {showForm && (
            <div className="surface p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-brand-navy">
                  Write a review
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-navy/55 hover:bg-brand-light hover:text-brand-navy"
                >
                  Cancel
                </button>
              </div>
              <div className="mt-4">
                <ReviewForm
                  productName={product.name}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          )}

          {reviews.loading ? (
            <LoadingState label="Loading reviews…" />
          ) : reviews.error ? (
            <p role="alert" className="text-sm text-danger">
              {reviews.error.message}
            </p>
          ) : list.length ? (
            list.map((review) => (
              <article key={review.id} className="surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-brand-navy">
                      {review.customer_name}
                    </p>
                    <StarRating
                      value={review.rating}
                      size="sm"
                      className="mt-1"
                    />
                  </div>
                  <p className="text-xs text-brand-navy/45">
                    {formatReviewDate(review.created_at)}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-navy/75">
                  {review.comment}
                </p>
              </article>
            ))
          ) : (
            <div className="surface p-8 text-center text-sm text-brand-navy/55">
              No reviews have been published for this product yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
