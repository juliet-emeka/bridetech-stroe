import { useState } from 'react'
import { CheckCircle2, Info, MessageCircle, ShoppingCart, Star } from 'lucide-react'
import { Button, Container, EmptyState, Input, SectionHeading } from '../../components/common'
import OrderSummary from '../../components/cart/OrderSummary'
import ReviewModal from '../../components/reviews/ReviewModal'
import { siteConfig } from '../../config/site'
import { useCart } from '../../context/useCart'
import { formatCurrency } from '../../services/catalogue'
import { createOrder } from '../../services/orders'
import {
  buildOrderMessage,
  buildWhatsappUrl,
  isWhatsappConfigured,
} from '../../services/whatsapp'

const validate = (values) => {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!/^0\d{10}$/.test(values.phone.trim())) {
    errors.phone = 'Enter an 11-digit phone number starting with 0.'
  }
  if (!values.delivery.trim()) {
    errors.delivery = 'Enter delivery information or your preferred address.'
  }
  return errors
}

export default function Checkout() {
  const { items, itemCount, subtotal, clearCart } = useCart()
  const [values, setValues] = useState({ name: '', phone: '', delivery: '' })
  const [errors, setErrors] = useState({})
  const [reviewed, setReviewed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [completedOrder, setCompletedOrder] = useState(null)
  const [reviewOpen, setReviewOpen] = useState(false)

  if (completedOrder) {
    return (
      <>
        <Container className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="Order received"
            title="Your order has been saved"
            description="Send the prefilled details to the store on WhatsApp to complete your order."
          />
          <div className="surface-blue mx-auto mt-8 max-w-2xl p-6 sm:p-8">
            <CheckCircle2 className="size-10 text-brand-primary" aria-hidden="true" />
            <p className="mt-4 text-sm text-brand-navy/70">Order reference</p>
            <p className="text-2xl font-extrabold tracking-wide text-brand-navy">
              {completedOrder.reference}
            </p>
            {completedOrder.demo && (
              <p className="mt-4 rounded-xl bg-brand-light p-3 text-sm text-brand-deep">
                Demo mode: this order was not saved to the store database.
              </p>
            )}
            <p className="mt-5 text-sm leading-relaxed text-brand-navy/70">
              A WhatsApp message with your name, phone, delivery details and items is ready. If WhatsApp did not open automatically, use the button below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href={completedOrder.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Open WhatsApp
              </Button>
              <Button to="/shop" variant="outline">
                Continue shopping
              </Button>
              {!completedOrder.demo && (
                <Button
                  variant="secondary"
                  onClick={() => setReviewOpen(true)}
                >
                  <Star className="size-4" aria-hidden="true" />
                  Leave a review
                </Button>
              )}
            </div>
          </div>
        </Container>

        {!completedOrder.demo && reviewOpen && (
          <ReviewModal
            items={completedOrder.items}
            defaultName={completedOrder.customerName}
            onClose={() => setReviewOpen(false)}
          />
        )}
      </>
    )
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Nothing to check out"
        description="Add products to your cart before starting checkout."
        action={<Button to="/shop">Browse products</Button>}
      />
    )
  }

  const setField = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setReviewed(false)
    setSubmitError('')
  }

  const handleReview = (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setReviewed(Object.keys(nextErrors).length === 0)
    setSubmitError('')
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true)
    setSubmitError('')

    try {
      const order = await createOrder({
        customerName: values.name.trim(),
        customerPhone: values.phone.trim(),
        deliveryAddress: values.delivery.trim(),
        items,
      })

      const reference = order.id
        ? order.id.slice(0, 8).toUpperCase()
        : `DEMO-${Date.now().toString(36).toUpperCase()}`
      const reviewItems = items.map(({ id, name }) => ({ id, name }))

      const message = buildOrderMessage({
        reference,
        customerName: values.name.trim(),
        customerPhone: values.phone.trim(),
        delivery: values.delivery.trim(),
        items,
        subtotal,
        demo: order.demo,
      })
      const url = buildWhatsappUrl(message)

      if (!url) {
        throw new Error('WhatsApp number has not been configured yet.')
      }

      setCompletedOrder({
        reference,
        url,
        demo: order.demo,
        items: reviewItems,
        customerName: values.name.trim(),
      })
      if (!order.demo) setReviewOpen(true)
      window.open(url, '_blank', 'noopener,noreferrer')
      clearCart()
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow="Checkout"
        title="Review your order"
        description="Confirm your details and the items in your cart."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-8">
          <section className="surface-blue p-5 sm:p-6">
            <h2 className="text-lg font-bold text-brand-navy">Your details</h2>
            <form onSubmit={handleReview} noValidate className="mt-5 grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                autoComplete="name"
                placeholder="Your name"
                value={values.name}
                error={errors.name}
                onChange={(event) => setField('name', event.target.value)}
              />
              <Input
                label="Phone number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="08012345678"
                value={values.phone}
                error={errors.phone}
                onChange={(event) => setField('phone', event.target.value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Delivery address or information"
                  autoComplete="street-address"
                  placeholder="Area, landmark or delivery instructions"
                  value={values.delivery}
                  error={errors.delivery}
                  onChange={(event) => setField('delivery', event.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" variant="outline">
                  Review order details
                </Button>
              </div>
            </form>
          </section>

          <section className="surface-blue p-5 sm:p-6">
            <h2 className="text-lg font-bold text-brand-navy">Items in your order</h2>
            <ul className="mt-4 divide-y divide-brand-light">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-brand-navy">
                    <span className="font-semibold">{item.quantity} ×</span> {item.name}
                  </span>
                  <span className="shrink-0 font-bold text-brand-navy">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {reviewed && (
            <div className="rounded-2xl border border-brand-primary/20 bg-brand-light/60 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-brand-deep">
                <CheckCircle2 className="size-5" aria-hidden="true" />
                Order details reviewed
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-deep/80">
                We'll save your order, then open WhatsApp with these details prefilled. The store will confirm availability, delivery and payment before dispatch.
              </p>

              {isWhatsappConfigured ? (
                <Button type="button" className="mt-4" onClick={handlePlaceOrder} disabled={submitting}>
                  <MessageCircle className="size-4" aria-hidden="true" />
                  {submitting ? 'Saving order…' : 'Send order on WhatsApp'}
                </Button>
              ) : (
                <p className="mt-4 rounded-xl bg-brand-white p-3 text-sm text-brand-deep">
                  WhatsApp checkout is not enabled yet. Add the store's WhatsApp number to <code>VITE_WHATSAPP_NUMBER</code> in <code>.env</code>.
                </p>
              )}

              {submitError && (
                <p role="alert" className="mt-3 text-sm font-semibold text-danger">
                  {submitError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28">
          <OrderSummary
            subtotal={subtotal}
            itemCount={itemCount}
            note="Delivery charges, if any, are confirmed by the store. This is not a payment confirmation."
          >
            <Button to="/cart" variant="outline" size="md" className="w-full">
              Back to cart
            </Button>
            <p className="mt-3 flex items-start gap-2 text-xs text-brand-navy/55">
              <Info className="mt-0.5 size-4 shrink-0 text-brand-primary" aria-hidden="true" />
              Questions? Call {siteConfig.phones.join(' or ')}.
            </p>
          </OrderSummary>
        </div>
      </div>
    </Container>
  )
}
