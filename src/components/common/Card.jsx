export default function Card({
  as: Component = 'div',
  interactive = false,
  className = '',
  children,
  ...props
}) {
  const hover = interactive
    ? 'transition duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lift'
    : ''

  return (
    <Component className={`surface ${hover} ${className}`} {...props}>
      {children}
    </Component>
  )
}
