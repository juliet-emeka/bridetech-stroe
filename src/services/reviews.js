import { isSupabaseConfigured, supabase } from '../lib/supabase'

export async function listApprovedReviews(productId) {
  if (!isSupabaseConfigured || !productId) return []

  const { data, error } = await supabase
    .from('reviews')
    .select('id, customer_name, rating, comment, created_at')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function submitReview({
  productId,
  customerName,
  rating,
  comment,
}) {
  if (!isSupabaseConfigured) {
    throw new Error('Reviews are not available in demo mode.')
  }

  const { error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      customer_name: customerName.trim(),
      rating,
      comment: comment.trim(),
      is_approved: false,
    })

  if (error) throw new Error(error.message)
  return true
}
