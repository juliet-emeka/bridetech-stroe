import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge, Button, Input, LoadingState } from '../../components/common'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import {
  deletePromotion,
  listAdminPromotions,
  savePromotion,
} from '../../services/admin'

const empty = {
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  startDate: '',
  endDate: '',
  isActive: true,
}

const toInputDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

export default function AdminPromotions() {
  const [reloadKey, setReloadKey] = useState(0)
  const [values, setValues] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const promotions = useAsyncResource(listAdminPromotions, `promotions-${reloadKey}`)

  const set = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await savePromotion(values, editingId)
      setValues(empty)
      setEditingId(null)
      setNotice('Promotion saved.')
      setReloadKey((value) => value + 1)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setBusy(false)
    }
  }

  const handleEdit = (promotion) => {
    setValues({
      title: promotion.title,
      description: promotion.description ?? '',
      discountType: promotion.discount_type,
      discountValue: String(promotion.discount_value),
      startDate: toInputDate(promotion.start_date),
      endDate: toInputDate(promotion.end_date),
      isActive: promotion.is_active,
    })
    setEditingId(promotion.id)
    setNotice('')
    setError('')
  }

  const handleDelete = async (promotion) => {
    if (!window.confirm(`Delete promotion "${promotion.title}"?`)) return
    setError('')
    try {
      await deletePromotion(promotion.id)
      setNotice('Promotion deleted.')
      setReloadKey((value) => value + 1)
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">Promotions</h2>
        <p className="mt-1 text-sm text-brand-navy/55">
          Record discounts and special offers. Public visitors only see active promotions within their date range.
        </p>
      </div>

      {notice && <p role="status" className="rounded-xl bg-brand-light p-3 text-sm text-brand-deep">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6">
        <h3 className="text-base font-bold text-brand-navy">
          {editingId ? 'Edit promotion' : 'Add promotion'}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Title" required value={values.title} onChange={(event) => set('title', event.target.value)} />
          <Input label="Description" value={values.description} onChange={(event) => set('description', event.target.value)} />
          <div>
            <label htmlFor="promo-type" className="mb-1.5 block text-sm font-semibold text-brand-navy">
              Discount type
            </label>
            <select
              id="promo-type"
              className="h-11 w-full rounded-xl border border-brand-light bg-brand-white px-3.5 text-sm outline-none focus:border-brand-primary"
              value={values.discountType}
              onChange={(event) => set('discountType', event.target.value)}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>
          <Input
            label="Discount value"
            type="number"
            min="0"
            step="0.01"
            required
            value={values.discountValue}
            onChange={(event) => set('discountValue', event.target.value)}
          />
          <Input
            label="Start date"
            type="datetime-local"
            value={values.startDate}
            onChange={(event) => set('startDate', event.target.value)}
          />
          <Input
            label="End date"
            type="datetime-local"
            value={values.endDate}
            onChange={(event) => set('endDate', event.target.value)}
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-brand-navy sm:col-span-2">
            <input
              type="checkbox"
              className="size-4 accent-brand-primary"
              checked={values.isActive}
              onChange={(event) => set('isActive', event.target.checked)}
            />
            Active
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add promotion'}
          </Button>
          {editingId && (
            <Button type="button" variant="ghost" size="sm" onClick={() => { setValues(empty); setEditingId(null) }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {promotions.loading ? (
        <LoadingState label="Loading promotions…" />
      ) : (
        <div className="surface divide-y divide-brand-light px-5">
          {promotions.data?.map((promotion) => (
            <div key={promotion.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="text-sm font-bold text-brand-navy">{promotion.title}</p>
                <p className="text-xs text-brand-navy/50">
                  {promotion.discount_type === 'percentage'
                    ? `${promotion.discount_value}% off`
                    : `${promotion.discount_value} off`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={promotion.is_active ? 'blue' : 'outline'}>
                  {promotion.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <button
                  type="button"
                  onClick={() => handleEdit(promotion)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-light"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(promotion)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!promotions.data?.length && (
            <p className="py-6 text-center text-sm text-brand-navy/55">No promotions yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
