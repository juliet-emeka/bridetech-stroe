import { useId, useState } from 'react'
import { Button, Input } from '../common'
import StarRating from './StarRating'

const validate = ({ name, rating, comment }) => {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Enter your name.'
  if (!rating) errors.rating = 'Choose a star rating.'
  if (comment.trim().length < 10) {
    errors.comment = 'Write at least 10 characters.'
  }
  return errors
}

export default function ReviewForm({
  defaultName = '',
  productName,
  onSubmit,
  submitLabel = 'Submit review',
}) {
  const [name, setName] = useState(defaultName)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [busy, setBusy] = useState(false)
  const commentId = useId()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate({ name, rating, comment })
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    setBusy(true)
    try {
      await onSubmit({
        customerName: name.trim(),
        rating,
        comment: comment.trim(),
      })
      setRating(0)
      setComment('')
      setErrors({})
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {productName && (
        <p className="mb-4 text-sm text-brand-navy/60">
          Reviewing <span className="font-semibold text-brand-navy">{productName}</span>
        </p>
      )}

      <Input
        label="Your name"
        autoComplete="name"
        placeholder="Your name"
        value={name}
        error={errors.name}
        onChange={(event) => {
          setName(event.target.value)
          setErrors((current) => ({ ...current, name: undefined }))
          setSubmitError('')
        }}
      />

      <fieldset className="mt-5">
        <legend className="mb-1.5 text-sm font-semibold text-brand-navy">
          Your rating
        </legend>
        <StarRating
          value={rating}
          size="lg"
          onChange={(nextRating) => {
            setRating(nextRating)
            setErrors((current) => ({ ...current, rating: undefined }))
            setSubmitError('')
          }}
        />
        {errors.rating && (
          <p className="mt-1.5 text-sm text-danger">{errors.rating}</p>
        )}
      </fieldset>

      <div className="mt-5">
        <label
          htmlFor={commentId}
          className="mb-1.5 block text-sm font-semibold text-brand-navy"
        >
          Your review
        </label>
        <textarea
          id={commentId}
          rows={4}
          maxLength={1000}
          placeholder="What did you think about this product?"
          value={comment}
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={errors.comment ? `${commentId}-error` : undefined}
          onChange={(event) => {
            setComment(event.target.value)
            setErrors((current) => ({ ...current, comment: undefined }))
            setSubmitError('')
          }}
          className={`w-full resize-y rounded-xl border bg-brand-white px-3.5 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 transition focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
            errors.comment
              ? 'border-danger focus:border-danger'
              : 'border-brand-light focus:border-brand-primary'
          }`}
        />
        <div className="mt-1.5 flex justify-between gap-3">
          {errors.comment ? (
            <p id={`${commentId}-error`} className="text-sm text-danger">
              {errors.comment}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-brand-navy/40">{comment.length}/1000</span>
        </div>
      </div>

      {submitError && (
        <p role="alert" className="mt-4 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          {submitError}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? 'Submitting…' : submitLabel}
        </Button>
        <p className="text-xs text-brand-navy/50">
          Reviews appear after the store approves them.
        </p>
      </div>
    </form>
  )
}
