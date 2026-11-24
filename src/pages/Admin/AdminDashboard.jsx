import { AlertCircle, Boxes, CheckCircle2, Clock3, PackageX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, LoadingState } from '../../components/common'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { formatCurrency } from '../../services/catalogue'
import { getDashboardData } from '../../services/admin'

const statusTone = {
  pending: 'blue',
  contacted: 'sky',
  confirmed: 'blue',
  processing: 'sky',
  completed: 'navy',
  cancelled: 'outline',
}

export default function AdminDashboard() {
  const { data, loading, error } = useAsyncResource(
    getDashboardData,
    'admin-dashboard',
  )

  if (loading) return <LoadingState label="Loading dashboard data…" />

  if (error) {
    return (
      <div className="surface flex items-start gap-3 p-6 text-sm text-danger">
        <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold">Dashboard data could not be loaded.</p>
          <p className="mt-1 text-brand-navy/60">{error.message}</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total products', value: data?.total ?? 0, icon: Boxes },
    { label: 'Available', value: data?.available ?? 0, icon: CheckCircle2 },
    { label: 'Out of stock', value: data?.outOfStock ?? 0, icon: PackageX },
    { label: 'Pending orders', value: data?.pending ?? 0, icon: Clock3 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">Store overview</h2>
        <p className="mt-1 text-sm text-brand-navy/55">
          Figures are read directly from Supabase.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-navy/55">
                {label}
              </span>
              <Icon className="size-5 text-brand-primary" aria-hidden="true" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-brand-navy">{value}</p>
          </div>
        ))}
      </div>

      <section className="surface overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-brand-light p-5">
          <h2 className="text-base font-bold text-brand-navy">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-brand-primary hover:underline">
            View all
          </Link>
        </div>

        {data?.recent?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-light/50 text-xs uppercase tracking-wider text-brand-navy/55">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light">
                {data.recent.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-3 font-semibold text-brand-navy">
                      {order.customer_name}
                    </td>
                    <td className="px-5 py-3 text-brand-navy/70">
                      {formatCurrency(order.order_total)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone[order.order_status] ?? 'blue'}>
                        {order.order_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-brand-navy/55">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-sm text-brand-navy/55">No orders have been submitted yet.</p>
        )}
      </section>
    </div>
  )
}
