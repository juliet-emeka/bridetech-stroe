import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-brand-primary text-white shadow-[0_10px_24px_rgba(0,112,240,0.28)] hover:bg-brand-deep hover:shadow-lift',
  secondary: 'bg-brand-light text-brand-deep hover:bg-brand-primary/15',
  outline:
    'border border-brand-primary/40 bg-brand-white text-brand-deep hover:border-brand-primary hover:bg-brand-primary hover:text-white',
  ghost: 'text-brand-deep hover:bg-brand-primary/10',
  navy: 'bg-brand-navy text-white hover:bg-brand-deep',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  to,
  href,
  type = 'button',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
