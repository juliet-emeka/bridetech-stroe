import { Link } from 'react-router-dom'
import { ArrowUpRight, Plus, ShoppingCart } from 'lucide-react'
import { Badge, Button } from '../common'
import { formatCurrency } from '../../services/catalogue'
import { useCart } from '../../context/useCart'
import ProductImage from './ProductImage'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const outOfStock = product.availabilityStatus === 'out_of_stock' || product.stockQuantity < 1
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const handleAdd = () => {
    addItem(product, 1)
  }

  return (
    <article className="surface-blue group relative flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-lift">
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-brand-gradient-soft"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isNewArrival && <Badge tone="sky">New</Badge>}
          {discount > 0 && <Badge tone="navy">-{discount}%</Badge>}
          {outOfStock && <Badge tone="outline">Out of stock</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
          {product.brand ?? 'Unbranded'}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-brand-navy">
          <Link to={`/product/${product.slug}`} className="hover:text-brand-primary">
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-brand-primary">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-brand-navy/40 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
          >
            {outOfStock ? (
              'Unavailable'
            ) : (
              <>
                <Plus className="size-4" aria-hidden="true" />
                Add to cart
              </>
            )}
          </Button>
          <Link
            to={`/product/${product.slug}`}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-brand-primary/20 text-brand-primary transition hover:bg-brand-light"
            aria-label={`View details for ${product.name}`}
          >
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {!outOfStock && product.stockQuantity <= 5 && (
          <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-brand-deep">
            <ShoppingCart className="size-3.5" aria-hidden="true" />
            Only {product.stockQuantity} left
          </p>
        )}
      </div>
    </article>
  )
}
