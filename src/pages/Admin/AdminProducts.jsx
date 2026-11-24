import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Badge, Button, LoadingState } from '../../components/common'
import ProductForm from '../../components/admin/ProductForm'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { formatCurrency } from '../../services/catalogue'
import { deleteProduct, listAdminCategories, listAdminProducts } from '../../services/admin'

export default function AdminProducts() {
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const products = useAsyncResource(listAdminProducts, `products-${reloadKey}`)
  const categories = useAsyncResource(listAdminCategories, `categories-${reloadKey}`)

  const refresh = () => setReloadKey((value) => value + 1)

  const handleSaved = () => {
    setEditing(null)
    setNotice('Product saved successfully.')
    setError('')
    refresh()
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setError('')
    try {
      await deleteProduct(product)
      setNotice('Product deleted.')
      refresh()
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  const showForm = editing === 'new' || Boolean(editing)
  const currentProduct = typeof editing === 'object' ? editing : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-navy">Products</h2>
          <p className="mt-1 text-sm text-brand-navy/55">
            Add, edit and remove products in the catalogue.
          </p>
        </div>
        <Button size="sm" onClick={() => { setEditing('new'); setNotice(''); setError('') }}>
          <Plus className="size-4" aria-hidden="true" />
          Add product
        </Button>
      </div>

      {notice && <p role="status" className="rounded-xl bg-brand-light p-3 text-sm text-brand-deep">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

      {showForm && (
        <ProductForm
          product={currentProduct}
          categories={categories.data ?? []}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      )}

      {products.loading || categories.loading ? (
        <LoadingState label="Loading products…" />
      ) : products.error || categories.error ? (
        <p role="alert" className="text-sm text-danger">
          {products.error?.message ?? categories.error?.message}
        </p>
      ) : products.data?.length ? (
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-light/50 text-xs uppercase tracking-wider text-brand-navy/55">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light">
              {products.data.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-brand-navy">{product.name}</p>
                    <p className="text-xs text-brand-navy/50">/{product.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-brand-navy/70">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-5 py-3 text-brand-navy/70">{product.stockQuantity}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone={product.availabilityStatus === 'available' ? 'blue' : 'outline'}>
                        {product.availabilityStatus.replace('_', ' ')}
                      </Badge>
                      {product.isFeatured && <Badge tone="navy">Featured</Badge>}
                      {product.isNewArrival && <Badge tone="sky">New</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditing(product); setNotice(''); setError('') }}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-light"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="surface p-8 text-center text-sm text-brand-navy/60">
          No products yet. Use “Add product” to create the first one.
        </div>
      )}
    </div>
  )
}
