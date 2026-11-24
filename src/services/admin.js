import { isSupabaseConfigured, supabase } from '../lib/supabase'

const BUCKET = 'product-images'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const requireClient = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add the project URL and key to .env.')
  }
  return supabase
}

const unwrap = ({ data, error }) => {
  if (error) throw new Error(error.message)
  return data
}

const friendlyError = (error) => {
  if (error?.code === '23505') {
    return new Error('That slug is already in use. Choose a different one.')
  }
  return error
}

export const mapAdminProduct = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description ?? '',
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : null,
  brand: row.brand ?? '',
  categoryId: row.category_id ?? '',
  imageUrls: row.image_urls ?? [],
  specifications: Array.isArray(row.specifications) ? row.specifications : [],
  stockQuantity: row.stock_quantity,
  availabilityStatus: row.availability_status,
  isFeatured: row.is_featured,
  isNewArrival: row.is_new_arrival,
  createdAt: row.created_at,
})

const productPayload = (values) => ({
  name: values.name.trim(),
  slug: values.slug.trim(),
  description: values.description.trim(),
  price: Number(values.price),
  original_price: values.originalPrice
    ? Number(values.originalPrice)
    : null,
  brand: values.brand.trim() || null,
  category_id: values.categoryId || null,
  image_urls: values.imageUrls,
  specifications: values.specifications.filter(
    (spec) => spec.label.trim() && spec.value.trim(),
  ),
  stock_quantity: Number(values.stockQuantity),
  availability_status: values.availabilityStatus,
  is_featured: values.isFeatured,
  is_new_arrival: values.isNewArrival,
})

export async function uploadProductImage(file) {
  const client = requireClient()
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPG, PNG and WebP images are allowed.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 5 MB or smaller.')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${Date.now()}-${safeName}`
  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error(error.message)

  const { data } = client.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

const storagePathFromUrl = (url) => {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const index = url?.indexOf(marker) ?? -1
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length)) : null
}

export async function removeProductImage(url) {
  const path = storagePathFromUrl(url)
  if (!path) return
  const client = requireClient()
  const { error } = await client.storage.from(BUCKET).remove([path])
  if (error) throw new Error(error.message)
}

export async function listAdminProducts() {
  const client = requireClient()
  const rows = unwrap(await client.from('products').select('*').order('created_at', { ascending: false }))
  return rows.map(mapAdminProduct)
}

export async function saveProduct(values, id = null) {
  const client = requireClient()
  const payload = productPayload(values)

  if (id) {
    const rows = unwrap(
      await client.from('products').update(payload).eq('id', id).select(),
    )
    return mapAdminProduct(rows[0])
  }

  const rows = unwrap(
    await client.from('products').insert(payload).select(),
  )
  return mapAdminProduct(rows[0])
}

export async function deleteProduct(product) {
  const client = requireClient()
  const { error } = await client.from('products').delete().eq('id', product.id)
  if (error) throw new Error(error.message)

  await Promise.all(
    product.imageUrls.map((url) => removeProductImage(url).catch(() => {})),
  )
}

export async function listAdminCategories() {
  const client = requireClient()
  return unwrap(await client.from('categories').select('*').order('name'))
}

export async function saveCategory(values, id = null) {
  const client = requireClient()
  const payload = {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: values.description.trim() || null,
  }

  if (id) {
    return unwrap(
      await client.from('categories').update(payload).eq('id', id).select().single(),
    )
  }
  return unwrap(await client.from('categories').insert(payload).select().single())
}

export async function deleteCategory(id) {
  const client = requireClient()
  const { error } = await client.from('categories').delete().eq('id', id)
  if (error) throw friendlyError(error)
}

export async function listAdminOrders() {
  const client = requireClient()
  return unwrap(
    await client
      .from('orders')
      .select('*, order_items(id, product_name, quantity, unit_price, subtotal)')
      .order('created_at', { ascending: false }),
  )
}

export async function updateOrderStatus(id, orderStatus) {
  const client = requireClient()
  return unwrap(
    await client
      .from('orders')
      .update({ order_status: orderStatus })
      .eq('id', id)
      .select()
      .single(),
  )
}

export async function updateOrderPaymentStatus(id, paymentStatus) {
  const client = requireClient()
  return unwrap(
    await client
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', id)
      .select()
      .single(),
  )
}

export async function listAdminPromotions() {
  const client = requireClient()
  return unwrap(
    await client.from('promotions').select('*').order('created_at', { ascending: false }),
  )
}

export async function savePromotion(values, id = null) {
  const client = requireClient()
  const payload = {
    title: values.title.trim(),
    description: values.description.trim() || null,
    discount_type: values.discountType,
    discount_value: Number(values.discountValue),
    start_date: values.startDate || null,
    end_date: values.endDate || null,
    is_active: values.isActive,
  }

  if (id) {
    return unwrap(
      await client.from('promotions').update(payload).eq('id', id).select().single(),
    )
  }
  return unwrap(await client.from('promotions').insert(payload).select().single())
}

export async function deletePromotion(id) {
  const client = requireClient()
  const { error } = await client.from('promotions').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function listAdminReviews() {
  const client = requireClient()
  return unwrap(
    await client
      .from('reviews')
      .select('*, products(name, slug)')
      .order('created_at', { ascending: false }),
  )
}

export async function updateReviewApproval(id, isApproved) {
  const client = requireClient()
  return unwrap(
    await client
      .from('reviews')
      .update({ is_approved: isApproved })
      .eq('id', id)
      .select()
      .single(),
  )
}

export async function deleteReview(id) {
  const client = requireClient()
  const { error } = await client.from('reviews').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

const fetchCount = async (table, column, value) => {
  const client = requireClient()
  let query = client.from(table).select('id', { count: 'exact', head: true })
  if (column) query = query.eq(column, value)
  const { count, error } = await query
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function getDashboardData() {
  const [total, available, outOfStock, pending, recent] = await Promise.all([
    fetchCount('products'),
    fetchCount('products', 'availability_status', 'available'),
    fetchCount('products', 'availability_status', 'out_of_stock'),
    fetchCount('orders', 'order_status', 'pending'),
    (async () => {
      const client = requireClient()
      return unwrap(
        await client
          .from('orders')
          .select('id, customer_name, order_total, order_status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      )
    })(),
  ])

  return { total, available, outOfStock, pending, recent }
}
