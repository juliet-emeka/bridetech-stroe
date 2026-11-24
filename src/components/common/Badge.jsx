const tones = {
  blue: 'bg-brand-light text-brand-primary',
  navy: 'bg-brand-navy text-white',
  outline: 'border border-brand-primary/25 text-brand-primary',
  sky: 'bg-brand-sky/15 text-brand-deep',
}

export default function Badge({ tone = 'blue', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-bold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
