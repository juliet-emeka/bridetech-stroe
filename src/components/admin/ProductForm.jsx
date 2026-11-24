import { useState } from 'react'
import { ImagePlus, Plus, Trash2, X } from 'lucide-react'
import { Button, Input } from '../common'
import { removeProductImage, saveProduct, uploadProductImage } from '../../services/admin'

const selectClass =
  'h-11 w-full rounded-xl border border-brand-light bg-brand-white px-3.5 text-sm text-brand-navy transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20'

const emptyValues = {
  name: '',
  slug: '',
  description: '',
  price: '',
  originalPrice: '',
  brand: '',
  categoryId: '',
  imageUrls: [],
  specifications: [{ label: '', value: '' }],
  stockQuantity: '0',
  availabilityStatus: 'available',
  isFeatured: false,
  isNewArrival: false,
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const initialValues = (product) =>
  product
    ? {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : '',
        brand: product.brand,
        categoryId: product.categoryId ?? '',
        imageUrls: product.imageUrls,
        specifications: product.specifications.length
          ? product.specifications
          : [{ label: '', value: '' }],
        stockQuantity: String(product.stockQuantity),
        availabilityStatus: product.availabilityStatus,
        isFeatured: product.isFeatured,
        isNewArrival: product.isNewArrival,
      }
    : emptyValues

export default function ProductForm({ product, categories, onSaved, onCancel }) {
  const [values, setValues] = useState(() => initialValues(product))
  const [slugTouched, setSlugTouched] = useState(Boolean(product))
  const [imageFile, setImageFile] = useState(null)
  const [removedImages, setRemovedImages] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const setSpecification = (index, key, value) => {
    setValues((current) => ({
      ...current,
      specifications: current.specifications.map((spec, i) =>
        i === index ? { ...spec, [key]: value } : spec,
      ),
    }))
  }

  const handleName = (value) => {
    setValues((current) => ({
      ...current,
      name: value,
      slug: slugTouched ? current.slug : slugify(value),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')

    if (!values.name.trim() || !values.slug.trim()) {
      setError('Product name and slug are required.')
      setBusy(false)
      return
    }
    if (values.price === '' || Number(values.price) < 0) {
      setError('Enter a valid price.')
      setBusy(false)
      return
    }
    if (
      values.originalPrice &&
      Number(values.originalPrice) < Number(values.price)
    ) {
      setError('Original price cannot be lower than the selling price.')
      setBusy(false)
      return
    }
    if (
      values.stockQuantity === '' ||
      !Number.isInteger(Number(values.stockQuantity)) ||
      Number(values.stockQuantity) < 0
    ) {
      setError('Stock quantity must be a whole number of zero or more.')
      setBusy(false)
      return
    }

    try {
      let imageUrls = [...values.imageUrls]
      if (imageFile) {
        const uploaded = await uploadProductImage(imageFile)
        imageUrls = [...imageUrls, uploaded.url]
      }

      await saveProduct({ ...values, imageUrls }, product?.id)

      await Promise.all(
        removedImages.map((url) => removeProductImage(url).catch(() => {})),
      )
      onSaved()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface p-5 sm:p-6">
      <h2 className="text-lg font-bold text-brand-navy">
        {product ? 'Edit product' : 'Add new product'}
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Input
          label="Product name"
          required
          value={values.name}
          onChange={(event) => handleName(event.target.value)}
        />
        <Input
          label="Slug"
          required
          hint="Used in the product URL"
          value={values.slug}
          onChange={(event) => {
            setSlugTouched(true)
            set('slug', slugify(event.target.value))
          }}
        />
        <Input
          label="Brand"
          value={values.brand}
          onChange={(event) => set('brand', event.target.value)}
        />
        <div>
          <label htmlFor="product-category" className="mb-1.5 block text-sm font-semibold text-brand-navy">
            Category
          </label>
          <select
            id="product-category"
            className={selectClass}
            value={values.categoryId}
            onChange={(event) => set('categoryId', event.target.value)}
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product-description" className="mb-1.5 block text-sm font-semibold text-brand-navy">
            Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="w-full rounded-xl border border-brand-light bg-brand-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            value={values.description}
            onChange={(event) => set('description', event.target.value)}
          />
        </div>

        <Input
          label="Price"
          type="number"
          min="0"
          step="0.01"
          required
          value={values.price}
          onChange={(event) => set('price', event.target.value)}
        />
        <Input
          label="Original price (optional)"
          type="number"
          min="0"
          step="0.01"
          value={values.originalPrice}
          onChange={(event) => set('originalPrice', event.target.value)}
        />
        <Input
          label="Stock quantity"
          type="number"
          min="0"
          step="1"
          required
          value={values.stockQuantity}
          onChange={(event) => set('stockQuantity', event.target.value)}
        />
        <div>
          <label htmlFor="product-status" className="mb-1.5 block text-sm font-semibold text-brand-navy">
            Availability
          </label>
          <select
            id="product-status"
            className={selectClass}
            value={values.availabilityStatus}
            onChange={(event) => set('availabilityStatus', event.target.value)}
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-brand-navy">
            Specifications
          </span>
          <div className="space-y-2">
            {values.specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className={`${selectClass} flex-1`}
                  placeholder="Label"
                  aria-label={`Specification ${index + 1} label`}
                  value={spec.label}
                  onChange={(event) => setSpecification(index, 'label', event.target.value)}
                />
                <input
                  className={`${selectClass} flex-1`}
                  placeholder="Value"
                  aria-label={`Specification ${index + 1} value`}
                  value={spec.value}
                  onChange={(event) => setSpecification(index, 'value', event.target.value)}
                />
                <button
                  type="button"
                  className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand-light text-brand-navy/50 hover:text-danger"
                  aria-label={`Remove specification ${index + 1}`}
                  onClick={() =>
                    set('specifications', values.specifications.filter((_, i) => i !== index))
                  }
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary"
            onClick={() =>
              set('specifications', [...values.specifications, { label: '', value: '' }])
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            Add specification
          </button>
        </div>

        <div className="sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-brand-navy">Product image</span>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-brand-light px-4 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-light">
            <ImagePlus className="size-4" aria-hidden="true" />
            Choose JPG, PNG or WebP image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
          </label>
          {imageFile && (
            <p className="mt-2 text-xs text-brand-navy/60">Selected: {imageFile.name}</p>
          )}
          {values.imageUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {values.imageUrls.map((url) => (
                <div key={url} className="flex items-center gap-2 rounded-xl bg-brand-light px-3 py-2 text-xs text-brand-deep">
                  <span className="max-w-48 truncate">{url.split('/').pop()}</span>
                  <button
                    type="button"
                    aria-label="Remove current image"
                    onClick={() => {
                      set('imageUrls', values.imageUrls.filter((item) => item !== url))
                      setRemovedImages((current) => [...current, url])
                    }}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
            <input
              type="checkbox"
              className="size-4 accent-brand-primary"
              checked={values.isFeatured}
              onChange={(event) => set('isFeatured', event.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
            <input
              type="checkbox"
              className="size-4 accent-brand-primary"
              checked={values.isNewArrival}
              onChange={(event) => set('isNewArrival', event.target.checked)}
            />
            New arrival
          </label>
        </div>
      </div>

      {error && <p role="alert" className="mt-5 text-sm text-danger">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving…' : product ? 'Save changes' : 'Create product'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
