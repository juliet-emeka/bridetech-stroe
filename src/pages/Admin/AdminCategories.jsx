import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button, Input, LoadingState } from '../../components/common'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import {
  deleteCategory,
  listAdminCategories,
  saveCategory,
} from '../../services/admin'

const empty = { name: '', slug: '', description: '' }

const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function AdminCategories() {
  const [reloadKey, setReloadKey] = useState(0)
  const [values, setValues] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const categories = useAsyncResource(listAdminCategories, `categories-${reloadKey}`)

  const refresh = () => setReloadKey((value) => value + 1)

  const set = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const handleName = (value) => {
    setValues((current) => ({
      ...current,
      name: value,
      slug: editingId ? current.slug : slugify(value),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await saveCategory(values, editingId)
      setValues(empty)
      setEditingId(null)
      setNotice('Category saved.')
      refresh()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setBusy(false)
    }
  }

  const handleEdit = (category) => {
    setValues({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
    })
    setEditingId(category.id)
    setNotice('')
    setError('')
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return
    setError('')
    try {
      await deleteCategory(category.id)
      setNotice('Category deleted.')
      refresh()
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">Categories</h2>
        <p className="mt-1 text-sm text-brand-navy/55">
          Organise products into groups customers can browse.
        </p>
      </div>

      {notice && <p role="status" className="rounded-xl bg-brand-light p-3 text-sm text-brand-deep">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

      <form onSubmit={handleSubmit} className="surface p-5 sm:p-6">
        <h3 className="text-base font-bold text-brand-navy">
          {editingId ? 'Edit category' : 'Add category'}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Name" required value={values.name} onChange={(event) => handleName(event.target.value)} />
          <Input label="Slug" required value={values.slug} onChange={(event) => set('slug', slugify(event.target.value))} />
          <div className="sm:col-span-2">
            <Input label="Description" value={values.description} onChange={(event) => set('description', event.target.value)} />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add category'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setValues(empty); setEditingId(null) }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {categories.loading ? (
        <LoadingState label="Loading categories…" />
      ) : (
        <div className="surface divide-y divide-brand-light px-5">
          {categories.data?.map((category) => (
            <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="text-sm font-bold text-brand-navy">{category.name}</p>
                <p className="text-xs text-brand-navy/50">/{category.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(category)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-light"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!categories.data?.length && (
            <p className="py-6 text-center text-sm text-brand-navy/55">No categories yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
