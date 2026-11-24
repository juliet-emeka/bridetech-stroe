import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '../../services/catalogue'
import { useCart } from '../../context/useCart'
import ProductImage from '../products/ProductImage'
import QuantitySelector from './QuantitySelector'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 border-b border-brand-light py-5 last:border-0">
      <Link
        to={`/product/${item.slug}`}
        className="size-20 shrink-0 overflow-hidden rounded-xl bg-brand-light sm:size-24"
      >
        <ProductImage src={item.imageUrl} alt={item.name} />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-navy">
              <Link to={`/product/${item.slug}`} className="hover:text-brand-primary">
                {item.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm font-semibold text-brand-primary">
              {formatCurrency(item.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy/50 transition hover:text-danger"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Remove
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector
            value={item.quantity}
            max={item.stockQuantity}
            onChange={(quantity) => updateQuantity(item.id, quantity)}
            label={item.name}
          />
          <span className="text-sm font-bold text-brand-navy">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
