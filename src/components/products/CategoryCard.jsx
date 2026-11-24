import { Link } from 'react-router-dom'
import {
  Cable,
  Cpu,
  Gamepad2,
  Laptop,
  Mouse,
  Plug,
  Smartphone,
  Watch,
} from 'lucide-react'

const icons = {
  smartphone: Smartphone,
  laptop: Laptop,
  gamepad: Gamepad2,
  cable: Cable,
  mouse: Mouse,
  watch: Watch,
  plug: Plug,
}

export default function CategoryCard({ category, count = 0 }) {
  const Icon = icons[category.icon] ?? Cpu

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="surface-blue group flex items-center gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-lift"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary transition group-hover:bg-brand-primary group-hover:text-white">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-brand-navy">
          {category.name}
        </span>
        <span className="mt-0.5 block text-xs text-brand-navy/50">
          {count} {count === 1 ? 'product' : 'products'}
        </span>
      </span>
    </Link>
  )
}
