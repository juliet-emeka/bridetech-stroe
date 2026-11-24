import { useId } from 'react'

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-brand-navy"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`h-11 w-full rounded-xl border bg-brand-white px-3.5 text-sm text-brand-navy placeholder:text-brand-navy/40 transition focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${error ? 'border-danger focus:border-danger' : 'border-brand-light focus:border-brand-primary'} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-brand-navy/60">
          {hint}
        </p>
      )}
    </div>
  )
}
