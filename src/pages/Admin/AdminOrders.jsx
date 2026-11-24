import { useState } from 'react'
import { LoadingState } from '../../components/common'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { formatCurrency } from '../../services/catalogue'
import {
  listAdminOrders,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from '../../services/admin'

const statuses = ['pending', 'contacted', 'confirmed', 'processing', 'completed', 'cancelled']
const paymentStatuses = [
  { value: 'awaiting_confirmation', label: 'Awaiting confirmation' },
  { value: 'paid_on_delivery', label: 'Paid / confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrders() {
  const [reloadKey, setReloadKey] = useState(0)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const orders = useAsyncResource(listAdminOrders, `orders-${reloadKey}`)

  const handleStatus = async (order, status) => {
    setBusyId(order.id)
    setError('')
    setNotice('')
    try {
      await updateOrderStatus(order.id, status)
      setNotice(`Order status updated to ${status}.`)
      setReloadKey((value) => value + 1)
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setBusyId(null)
    }
  }

  const handlePaymentStatus = async (order, paymentStatus) => {
    setBusyId(order.id)
    setError('')
    setNotice('')
    try {
      await updateOrderPaymentStatus(order.id, paymentStatus)
      const label = paymentStatuses.find(
        (item) => item.value === paymentStatus,
      )?.label
      setNotice(`Payment status updated to ${label}.`)
      setReloadKey((value) => value + 1)
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">Orders</h2>
        <p className="mt-1 text-sm text-brand-navy/55">
          Review submitted orders and update their status. WhatsApp messages are
          sent manually by the store.
        </p>
      </div>

      {notice && <p role="status" className="rounded-xl bg-brand-light p-3 text-sm text-brand-deep">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

      {orders.loading ? (
        <LoadingState label="Loading orders…" />
      ) : orders.error ? (
        <p role="alert" className="text-sm text-danger">{orders.error.message}</p>
      ) : orders.data?.length ? (
        <div className="space-y-4">
          {orders.data.map((order) => (
            <details key={order.id} className="surface p-5">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-brand-navy">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-brand-navy/50">
                    {new Date(order.created_at).toLocaleString()} · {order.customer_phone}
                  </p>
                </div>
                <p className="text-sm font-extrabold text-brand-navy">
                  {formatCurrency(order.order_total)}
                </p>
              </summary>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/55">
                    Delivery information
                  </p>
                  <p className="mt-1.5 text-sm text-brand-navy/75">{order.delivery_address}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-navy/55">
                    Items
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm text-brand-navy/75">
                    {order.order_items?.map((item) => (
                      <li key={item.id}>
                        {item.quantity} × {item.product_name} — {formatCurrency(item.subtotal)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label
                    htmlFor={`status-${order.id}`}
                    className="mb-1.5 block text-sm font-semibold text-brand-navy"
                  >
                    Order status
                  </label>
                  <select
                    id={`status-${order.id}`}
                    className="h-11 w-full rounded-xl border border-brand-light bg-brand-white px-3.5 text-sm text-brand-navy outline-none focus:border-brand-primary"
                    value={order.order_status}
                    disabled={busyId === order.id}
                    onChange={(event) => handleStatus(order, event.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <label
                    htmlFor={`payment-${order.id}`}
                    className="mb-1.5 mt-4 block text-sm font-semibold text-brand-navy"
                  >
                    Payment status
                  </label>
                  <select
                    id={`payment-${order.id}`}
                    className="h-11 w-full rounded-xl border border-brand-light bg-brand-white px-3.5 text-sm text-brand-navy outline-none focus:border-brand-primary"
                    value={order.payment_status}
                    disabled={busyId === order.id}
                    onChange={(event) => handlePaymentStatus(order, event.target.value)}
                  >
                    {paymentStatuses.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="surface p-8 text-center text-sm text-brand-navy/55">
          No orders have been submitted yet.
        </div>
      )}
    </div>
  )
}
