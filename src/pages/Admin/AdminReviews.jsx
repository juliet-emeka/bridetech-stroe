import { useState } from 'react'
import { CheckCircle2, Star, Trash2, XCircle } from 'lucide-react'
import { Badge, Button, LoadingState } from '../../components/common'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import {
  deleteReview,
  listAdminReviews,
  updateReviewApproval,
} from '../../services/admin'

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : '—'

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={`size-3.5 ${
            star <= rating ? 'fill-current text-brand-primary' : 'text-brand-navy/20'
          }`}
        />
      ))}
    </span>
  )
}

export default function AdminReviews() {
  const [reloadKey, setReloadKey] = useState(0)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const reviews = useAsyncResource(listAdminReviews, `reviews-${reloadKey}`)

  const refresh = () => setReloadKey((value) => value + 1)

  const handleApproval = async (review, isApproved) => {
    setBusyId(review.id)
    setError('')
    setNotice('')
    try {
      await updateReviewApproval(review.id, isApproved)
      setNotice(isApproved ? 'Review approved.' : 'Review unapproved.')
      refresh()
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (review) => {
    if (!window.confirm(`Delete the review from "${review.customer_name}"?`)) return
    setBusyId(review.id)
    setError('')
    setNotice('')
    try {
      await deleteReview(review.id)
      setNotice('Review deleted.')
      refresh()
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">Reviews</h2>
        <p className="mt-1 text-sm text-brand-navy/55">
          Approve reviews before they appear publicly, or remove reviews that
          should not be shown.
        </p>
      </div>

      {notice && (
        <p role="status" className="rounded-xl bg-brand-light p-3 text-sm text-brand-deep">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      {reviews.loading ? (
        <LoadingState label="Loading reviews…" />
      ) : reviews.error ? (
        <p role="alert" className="text-sm text-danger">
          {reviews.error.message}
        </p>
      ) : reviews.data?.length ? (
        <div className="space-y-4">
          {reviews.data.map((review) => (
            <article key={review.id} className="surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-brand-navy">
                      {review.customer_name}
                    </p>
                    <Badge tone={review.is_approved ? 'blue' : 'outline'}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-brand-navy/50">
                    <Stars rating={review.rating} />
                    <span>{formatDate(review.created_at)}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-brand-primary">
                    {review.products?.name ?? 'Product removed'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={review.is_approved ? 'outline' : 'primary'}
                    disabled={busyId === review.id}
                    onClick={() => handleApproval(review, !review.is_approved)}
                  >
                    {review.is_approved ? (
                      <XCircle className="size-4" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    )}
                    {review.is_approved ? 'Unapprove' : 'Approve'}
                  </Button>
                  <button
                    type="button"
                    disabled={busyId === review.id}
                    onClick={() => handleDelete(review)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/5 disabled:opacity-50"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-brand-navy/75">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="surface p-8 text-center text-sm text-brand-navy/55">
          No reviews have been submitted yet.
        </div>
      )}
    </div>
  )
}
