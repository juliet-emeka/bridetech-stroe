import { useState } from 'react'
import { Star } from 'lucide-react'

const sizes = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7',
}

export default function StarRating({
  value = 0,
  onChange,
  size = 'md',
  className = '',
}) {
  const [hovered, setHovered] = useState(0)
  const interactive = typeof onChange === 'function'
  const active = interactive ? hovered || value : value

  if (!interactive) {
    return (
      <span
        role="img"
        aria-label={`${value} out of 5 stars`}
        className={`inline-flex items-center gap-0.5 ${className}`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={`${sizes[size]} ${
              star <= value ? 'fill-current text-brand-primary' : 'text-brand-navy/20'
            }`}
          />
        ))}
      </span>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className={`inline-flex items-center gap-1 ${className}`}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(0)}
          className="rounded-lg p-0.5 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
        >
          <Star
            aria-hidden="true"
            className={`${sizes[size]} ${
              star <= active ? 'fill-current text-brand-primary' : 'text-brand-navy/20'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
