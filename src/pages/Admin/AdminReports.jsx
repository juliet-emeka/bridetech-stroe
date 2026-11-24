import { useMemo, useState } from 'react'
import { CalendarDays, Download, Receipt } from 'lucide-react'
import { Badge, Button, LoadingState } from '../../components/common'
import SalesChart from '../../components/admin/SalesChart'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { formatCurrency } from '../../services/catalogue'
import { listAdminOrders } from '../../services/admin'

const periods = [
  { id: 'day', label: 'Day', description: 'Today' },
  { id: 'week', label: 'Week', description: 'Last 7 days' },
  { id: 'month', label: 'Month', description: 'Last 30 days' },
]

const periodDescriptions = {
  day: 'Today',
  week: 'Last 7 days',
  month: 'Last 30 days',
}

const statusTone = {
  pending: 'blue',
  contacted: 'sky',
  confirmed: 'blue',
  processing: 'sky',
  completed: 'navy',
  cancelled: 'outline',
}

const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

function buildCsv(report, period, range) {
  const rows = [
    ['BRIDETECH STORE'],
    ['Sales report', periodDescriptions[period]],
    ['Generated', range.end.toLocaleString()],
    ['Total sales (NGN)', report.totalSales.toFixed(2)],
    ['Orders', report.orderCount],
    ['Average order (NGN)', report.averageOrder.toFixed(2)],
    ['Paid / confirmed', report.paidCount],
    [],
    [
      'Reference',
      'Date',
      'Customer',
      'Phone',
      'Order status',
      'Payment status',
      'Total (NGN)',
    ],
    ...report.list.map((order) => [
      order.id.slice(0, 8).toUpperCase(),
      new Date(order.created_at).toLocaleString(),
      order.customer_name,
      order.customer_phone,
      order.order_status,
      order.payment_status.replaceAll('_', ' '),
      Number(order.order_total || 0).toFixed(2),
    ]),
    [],
    ['Total', '', '', '', '', '', report.totalSales.toFixed(2)],
  ]

  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n')
}

function getRange(period) {
  const end = new Date()
  const start = new Date(end)

  if (period === 'day') {
    start.setHours(0, 0, 0, 0)
  } else {
    start.setDate(end.getDate() - (period === 'week' ? 6 : 29))
    start.setHours(0, 0, 0, 0)
  }

  return { start, end }
}

function buildPoints(orders, period, range) {
  if (period === 'day') {
    return Array.from({ length: 24 }, (_, hour) => ({
      label: `${String(hour).padStart(2, '0')}:00`,
      value: orders
        .filter((order) => new Date(order.created_at).getHours() === hour)
        .reduce((sum, order) => sum + Number(order.order_total || 0), 0),
    }))
  }

  const dayCount = period === 'week' ? 7 : 30
  return Array.from({ length: dayCount }, (_, index) => {
    const day = new Date(range.start)
    day.setDate(range.start.getDate() + index)
    const key = day.toDateString()
    return {
      label: day.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
      value: orders
        .filter(
          (order) => new Date(order.created_at).toDateString() === key,
        )
        .reduce((sum, order) => sum + Number(order.order_total || 0), 0),
    }
  })
}

export default function AdminReports() {
  const [period, setPeriod] = useState('week')
  const orders = useAsyncResource(listAdminOrders, 'reports-orders')
  const range = useMemo(() => getRange(period), [period])

  const report = useMemo(() => {
    const list = (orders.data ?? []).filter((order) => {
      if (order.order_status === 'cancelled') return false
      const createdAt = new Date(order.created_at)
      return createdAt >= range.start && createdAt <= range.end
    })
    const totalSales = list.reduce(
      (sum, order) => sum + Number(order.order_total || 0),
      0,
    )
    return {
      list,
      totalSales,
      orderCount: list.length,
      averageOrder: list.length ? totalSales / list.length : 0,
      paidCount: list.filter(
        (order) => order.payment_status === 'paid_on_delivery',
      ).length,
      points: buildPoints(list, period, range),
    }
  }, [orders.data, period, range])

  const handleExport = () => {
    const csv = buildCsv(report, period, range)
    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bridetech-sales-${period}-${range.end.toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  if (orders.loading) return <LoadingState label="Loading sales report…" />

  if (orders.error) {
    return (
      <div role="alert" className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
        {orders.error.message}
      </div>
    )
  }

  return (
    <div className="print-area space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-navy">Sales reports</h2>
          <p className="mt-1 text-sm text-brand-navy/55">
            View and download sales by day, week or month as an Excel-compatible file. Cancelled orders are excluded.
          </p>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2">
          {periods.map((option) => (
            <Button
              key={option.id}
              size="sm"
              variant={period === option.id ? 'primary' : 'outline'}
              onClick={() => setPeriod(option.id)}
            >
              {option.label}
            </Button>
          ))}
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExport}
          >
            <Download className="size-4" aria-hidden="true" />
            Print Report
          </Button>
        </div>
      </div>

      <section className="surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Receipt className="mt-0.5 size-6 text-brand-primary" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
                BRIDETECH STORE
              </p>
              <h3 className="mt-1 text-xl font-extrabold text-brand-navy">
                Sales report
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-navy/55">
                <CalendarDays className="size-4" aria-hidden="true" />
                {periodDescriptions[period]}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-brand-navy/50">
            <p>Generated</p>
            <p>{range.end.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total sales', value: formatCurrency(report.totalSales) },
          { label: 'Orders', value: report.orderCount },
          { label: 'Average order', value: formatCurrency(report.averageOrder) },
          { label: 'Paid on delivery', value: report.paidCount },
        ].map((stat) => (
          <div key={stat.label} className="surface p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/55">
              {stat.label}
            </p>
            <p className="mt-3 text-2xl font-extrabold text-brand-navy">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <section className="surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-brand-navy">Sales trend</h3>
          <p className="text-xs text-brand-navy/50">{periodDescriptions[period]}</p>
        </div>
        <div className="mt-4">
          <SalesChart points={report.points} />
        </div>
        {!report.orderCount && (
          <p className="mt-3 text-sm text-brand-navy/50">
            No sales were recorded in this period.
          </p>
        )}
      </section>

      <section className="surface overflow-hidden">
        <div className="border-b border-brand-light p-5">
          <h3 className="text-base font-bold text-brand-navy">Orders in period</h3>
        </div>
        {report.list.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-light/50 text-xs uppercase tracking-wider text-brand-navy/55">
                <tr>
                  <th className="px-4 py-3">Ref</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light">
                {report.list.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-mono text-xs text-brand-navy/60">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-brand-navy/70">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-brand-navy">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-brand-navy/50">
                        {order.customer_phone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[order.order_status] ?? 'blue'}>
                        {order.order_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-brand-navy/65">
                      {order.payment_status.replaceAll('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-brand-navy">
                      {formatCurrency(order.order_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-brand-light/40 font-bold text-brand-navy">
                <tr>
                  <td className="px-4 py-3" colSpan="5">Total</td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(report.totalSales)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="p-6 text-sm text-brand-navy/55">
            No orders in this period.
          </p>
        )}
      </section>
    </div>
  )
}
