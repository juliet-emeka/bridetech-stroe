import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext'
const STORAGE_KEY = 'bridetech-cart-v1'

const normalizeItem = (item) => {
  if (!item || typeof item.id !== 'string') return null
  const stock = Number(item.stockQuantity) || 0
  const quantity = Math.min(Math.max(Number(item.quantity) || 1, 1), stock || 1)
  return {
    id: item.id,
    slug: item.slug,
    name: String(item.name ?? 'Product'),
    price: Number(item.price) || 0,
    imageUrl: item.imageUrl ?? null,
    stockQuantity: stock,
    quantity,
  }
}

const readStoredItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeItem).filter(Boolean)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredItems)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = useCallback((product, requestedQuantity = 1) => {
    if (product.availabilityStatus === 'out_of_stock' || product.stockQuantity < 1) {
      return false
    }

    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (!existing) {
        return [
          ...current,
          {
            ...normalizeItem({
              ...product,
              quantity: requestedQuantity,
            }),
          },
        ]
      }

      const nextQuantity = Math.min(
        existing.quantity + requestedQuantity,
        product.stockQuantity,
      )
      return current.map((item) =>
        item.id === product.id ? { ...item, quantity: nextQuantity } : item,
      )
    })
    return true
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    setItems((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item
          const next = Math.min(Math.max(Math.trunc(quantity) || 1, 1), item.stockQuantity || 1)
          return { ...item, quantity: next }
        })
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    return {
      items,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }
  }, [items, addItem, updateQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

