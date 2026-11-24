import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BadgePercent,
  ChartLine,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Star,
  Tags,
} from 'lucide-react'
import { Button, Container } from '../common'
import { useAuth } from '../../context/useAuth'

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/promotions', label: 'Promotions', icon: BadgePercent },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/reports', label: 'Reports', icon: ChartLine },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-primary text-white'
      : 'text-brand-navy/70 hover:bg-brand-light hover:text-brand-primary'
  }`

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
            BRIDETECH STORE
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-brand-navy">
            Admin dashboard
          </h1>
          <p className="mt-1 text-sm text-brand-navy/55">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="surface flex gap-1 overflow-x-auto p-2 lg:h-fit lg:flex-col" aria-label="Admin navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0"><Outlet /></div>
      </div>
    </Container>
  )
}
