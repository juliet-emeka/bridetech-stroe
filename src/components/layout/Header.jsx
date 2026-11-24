import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Phone, Search, ShoppingCart, X } from 'lucide-react'
import { Container, Logo } from '../common'
import { navigation, siteConfig } from '../../config/site'
import { useCart } from '../../context/useCart'

const iconButton =
  'relative grid size-10 place-items-center rounded-full text-brand-navy transition hover:bg-brand-light hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright'

function navClass({ isActive }) {
  return `rounded-pill px-3.5 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-primary/10 text-brand-primary shadow-[inset_0_-2px_0_#0070f0]'
      : 'text-brand-navy/70 hover:bg-brand-light hover:text-brand-primary'
  }`
}

export default function Header() {
  const [openPath, setOpenPath] = useState(null)
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { itemCount } = useCart()
  const mobileOpen = openPath === location.pathname

  const handleSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-light bg-brand-white/95 backdrop-blur">
      <div className="bg-brand-navy text-white">
        <Container className="flex h-8 items-center justify-between text-xs">
          <span className="hidden text-[11px] font-bold uppercase tracking-[0.18em] text-white/75 sm:block">
            {siteConfig.tagline}
          </span>
          <a
            href={`tel:${siteConfig.phones[0]}`}
            className="inline-flex items-center gap-1.5 font-semibold transition hover:text-brand-sky"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {siteConfig.phones.join('  •  ')}
          </a>
        </Container>
      </div>

      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="shrink-0 rounded-xl bg-brand-navy px-3 py-1.5"
          aria-label={`${siteConfig.name} home`}
        >
          <Logo className="h-9" />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          role="search"
          className="hidden max-w-xs flex-1 items-center gap-2 rounded-pill border border-brand-light bg-brand-white px-3.5 transition focus-within:border-brand-primary md:flex"
        >
          <Search className="size-4 shrink-0 text-brand-navy/50" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search gadgets…"
            aria-label="Search products"
            className="h-10 w-full bg-transparent text-sm text-brand-navy outline-none placeholder:text-brand-navy/40"
          />
        </form>

        <div className="flex items-center gap-1">
          <Link to="/shop" className={`${iconButton} md:hidden`} aria-label="Search products">
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <Link to="/cart" className={iconButton} aria-label={`Shopping cart, ${itemCount} items`}>
            <ShoppingCart className="size-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className={`${iconButton} lg:hidden`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setOpenPath(mobileOpen ? null : location.pathname)}
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <nav
          className="border-t border-brand-light bg-brand-white lg:hidden"
          aria-label="Mobile navigation"
        >
          <Container className="flex flex-col py-3">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </Container>
        </nav>
      )}
    </header>
  )
}
