import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { categories, demoProducts } from '../data/catalogue'

const categoryIcons = {
  smartphones: 'smartphone',
  'laptops-computers': 'laptop',
  'gaming-consoles': 'gamepad',
  'phone-accessories': 'cable',
  'laptop-accessories': 'mouse',
  'smart-devices': 'watch',
  'other-electronics': 'plug',
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value ?? 0)

export const isDemoCatalogue = !isSupabaseConfigured

const mapCategory = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description ?? '',
  icon: categoryIcons[row.slug] ?? 'cpu',
})

const mapProduct = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description ?? '',
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : null,
  brand: row.brand,
  categoryId: row.category_id,
  imageUrl: row.image_urls?.[0] ?? null,
  specifications: Array.isArray(row.specifications) ? row.specifications : [],
  stockQuantity: row.stock_quantity,
  availabilityStatus: row.availability_status,
  isFeatured: row.is_featured,
  isNewArrival: row.is_new_arrival,
  createdAt: row.created_at,
})

const matchesSearch = (product, search) => {
  if (!search) return true
  const term = search.trim().toLowerCase()
  return [product.name, product.brand, product.description].some((value) =>
    value?.toLowerCase().includes(term),
  )
}

const sortProducts = (list, sort) => {
  const sorted = [...list]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      )
  }
}

const demoListCategories = async () => categories

const demoListProducts = async (options = {}) => {
  const { search, category, minPrice, maxPrice, sort = 'newest' } = options
  let result = demoProducts.filter((product) => matchesSearch(product, search))

  if (category) {
    const matched = categories.find(
      (item) => item.slug === category || item.id === category,
    )
    const categoryId = matched?.id ?? category
    result = result.filter((product) => product.categoryId === categoryId)
  }
  if (minPrice !== undefined && minPrice !== '') {
    result = result.filter((product) => product.price >= Number(minPrice))
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    result = result.filter((product) => product.price <= Number(maxPrice))
  }

  return sortProducts(result, sort)
}

const demoGetCategoryCounts = async () =>
  demoProducts.reduce((counts, product) => {
    counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1
    return counts
  }, {})

const applySort = (query, sort) => {
  switch (sort) {
    case 'price-asc':
      return query.order('price', { ascending: true })
    case 'price-desc':
      return query.order('price', { ascending: false })
    case 'name':
      return query.order('name', { ascending: true })
    default:
      return query.order('created_at', { ascending: false })
  }
}

const requireData = ({ data, error }) => {
  if (error) throw new Error(error.message)
  return data
}

const remoteListCategories = async () => {
  const rows = requireData(
    await supabase.from('categories').select('*').order('name'),
  )
  return rows.map(mapCategory)
}

const remoteListProducts = async (options = {}) => {
  const { search, category, minPrice, maxPrice, sort = 'newest' } = options
  let query = supabase
    .from('products')
    .select('*')
    .eq('availability_status', 'available')

  if (search?.trim()) {
    query = query.ilike('name', `%${search.trim()}%`)
  }
  if (category) {
    const { data: categoryRow, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .maybeSingle()
    if (categoryError) throw new Error(categoryError.message)
    query = query.eq('category_id', categoryRow?.id ?? category)
  }
  if (minPrice !== undefined && minPrice !== '') {
    query = query.gte('price', Number(minPrice))
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    query = query.lte('price', Number(maxPrice))
  }

  const rows = requireData(await applySort(query, sort))
  return rows.map(mapProduct)
}

const remoteCollection = async (column, limit, value = true) => {
  const rows = requireData(
    await supabase
      .from('products')
      .select('*')
      .eq('availability_status', 'available')
      .eq(column, value)
      .order('created_at', { ascending: false })
      .limit(limit),
  )
  return rows.map(mapProduct)
}

const remoteGetProductBySlug = async (slug) => {
  const row = requireData(
    await supabase.from('products').select('*').eq('slug', slug).maybeSingle(),
  )
  return row ? mapProduct(row) : null
}

const remoteGetCategoryBySlug = async (slug) => {
  const row = requireData(
    await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle(),
  )
  return row ? mapCategory(row) : null
}

const remoteGetCategoryCounts = async () => {
  const rows = requireData(await supabase.from('products').select('category_id'))
  return rows.reduce((counts, row) => {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1
    return counts
  }, {})
}

const remoteGetRelatedProducts = async (product, limit) => {
  if (!product.categoryId) return []
  const rows = requireData(
    await supabase
      .from('products')
      .select('*')
      .eq('availability_status', 'available')
      .eq('category_id', product.categoryId)
      .neq('id', product.id)
      .order('created_at', { ascending: false })
      .limit(limit),
  )
  return rows.map(mapProduct)
}

export const listCategories = isSupabaseConfigured
  ? remoteListCategories
  : demoListCategories

export const listProducts = isSupabaseConfigured
  ? remoteListProducts
  : demoListProducts

export const getCategoryCounts = isSupabaseConfigured
  ? remoteGetCategoryCounts
  : demoGetCategoryCounts

export const getFeaturedProducts = isSupabaseConfigured
  ? (limit = 4) => remoteCollection('is_featured', limit)
  : async (limit = 4) => demoProducts.filter((p) => p.isFeatured).slice(0, limit)

export const getNewArrivals = isSupabaseConfigured
  ? (limit = 4) => remoteCollection('is_new_arrival', limit)
  : async (limit = 4) => demoProducts.filter((p) => p.isNewArrival).slice(0, limit)

export const getSpecialOffers = isSupabaseConfigured
  ? async (limit = 4) => {
      const rows = requireData(
        await supabase
          .from('products')
          .select('*')
          .eq('availability_status', 'available')
          .gt('original_price', 0)
          .order('created_at', { ascending: false })
          .limit(limit),
      )
      return rows.map(mapProduct)
    }
  : async (limit = 4) => demoProducts.filter((p) => p.originalPrice).slice(0, limit)

export const getProductBySlug = isSupabaseConfigured
  ? remoteGetProductBySlug
  : async (slug) => demoProducts.find((p) => p.slug === slug) ?? null

export const getCategoryBySlug = isSupabaseConfigured
  ? remoteGetCategoryBySlug
  : async (slug) => categories.find((c) => c.slug === slug) ?? null

export const getRelatedProducts = isSupabaseConfigured
  ? remoteGetRelatedProducts
  : async (product, limit = 4) =>
      demoProducts
        .filter(
          (item) =>
            item.id !== product.id && item.categoryId === product.categoryId,
        )
        .slice(0, limit)

export async function listPublicPromotions() {
  if (!isSupabaseConfigured) return []

  const rows = requireData(
    await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false }),
  )

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    discountLabel:
      row.discount_type === 'percentage'
        ? `${row.discount_value}% off`
        : `${formatCurrency(row.discount_value)} off`,
    startDate: row.start_date,
    endDate: row.end_date,
  }))
}
