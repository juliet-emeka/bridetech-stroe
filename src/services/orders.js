import { isSupabaseConfigured, supabase } from '../lib/supabase'

export async function createOrder({
  customerName,
  customerPhone,
  deliveryAddress,
  items,
}) {
  if (!isSupabaseConfigured) {
    return { id: null, demo: true }
  }

  const { data, error } = await supabase.rpc('create_order', {
    p_customer_name: customerName,
    p_customer_phone: customerPhone,
    p_delivery_address: deliveryAddress,
    p_items: items.map(({ id, quantity }) => ({
      product_id: id,
      quantity,
    })),
  })

  if (error) throw new Error(error.message)
  return { id: data, demo: false }
}
