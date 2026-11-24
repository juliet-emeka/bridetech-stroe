import { siteConfig } from '../config/site'
import { formatCurrency } from './catalogue'

const toDigits = (value) => String(value ?? '').replace(/\D/g, '')

export function getWhatsappNumber() {
  const configured =
    import.meta.env.VITE_WHATSAPP_NUMBER?.trim() || siteConfig.whatsappNumber
  if (!configured) return ''

  const digits = toDigits(configured)
  if (digits.startsWith('0')) return `234${digits.slice(1)}`
  return digits
}

export const isWhatsappConfigured = Boolean(getWhatsappNumber())

export function buildOrderMessage({
  reference,
  customerName,
  customerPhone,
  delivery,
  items,
  subtotal,
  demo,
}) {
  const lines = [
    `Hello ${siteConfig.name}, I would like to place this order.`,
    '',
    `Order reference: ${reference}`,
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Delivery: ${delivery}`,
    '',
    'Items:',
    ...items.map(
      (item) =>
        `- ${item.quantity} x ${item.name} = ${formatCurrency(item.price * item.quantity)}`,
    ),
    '',
    `Subtotal: ${formatCurrency(subtotal)}`,
    '',
  ]

  lines.push(
    demo
      ? 'This is a demo catalogue order and was not saved to the store database.'
      : 'Please confirm availability, delivery charge and payment details.',
  )

  return lines.join('\n')
}

export function buildWhatsappUrl(message) {
  const number = getWhatsappNumber()
  if (!number) return ''
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
