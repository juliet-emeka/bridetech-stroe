import { ImageOff } from 'lucide-react'

export default function ProductImage({ src, alt, className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`size-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex size-full flex-col items-center justify-center gap-2 bg-brand-gradient-soft text-brand-primary/50 ${className}`}
      role="img"
      aria-label={`${alt} image not supplied`}
    >
      <ImageOff className="size-8" aria-hidden="true" />
      <span className="text-[10px] font-semibold uppercase tracking-wider">
        Image to be supplied
      </span>
    </div>
  )
}
