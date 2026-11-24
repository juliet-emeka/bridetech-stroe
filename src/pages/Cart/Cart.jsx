import { ShoppingCart } from 'lucide-react'
import { Button, Container, EmptyState, SectionHeading } from '../../components/common'
import CartItem from '../../components/cart/CartItem'
import OrderSummary from '../../components/cart/OrderSummary'
import { useCart } from '../../context/useCart'

export default function Cart() {
  const { items, itemCount, subtotal, clearCart } = useCart()

  if (!items.length) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Browse the catalogue and add gadgets you are interested in."
        action={<Button to="/shop">Start shopping</Button>}
      />
    )
  }

  const handleClear = () => {
    if (window.confirm('Remove all items from your cart?')) clearCart()
  }

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow="Your basket"
        title="Shopping cart"
        description="Review quantities and products before proceeding to checkout."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="surface-blue px-5 py-2 sm:px-6">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          <div className="py-4 text-right">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-brand-navy/50 transition hover:text-danger"
            >
              Clear cart
            </button>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-28">
          <OrderSummary subtotal={subtotal} itemCount={itemCount}>
            <Button to="/checkout" size="lg" className="w-full">
              Proceed to checkout
            </Button>
            <div className="mt-3 text-center">
              <Button to="/shop" variant="ghost" size="sm">
                Continue shopping
              </Button>
            </div>
          </OrderSummary>
        </div>
      </div>
    </Container>
  )
}
