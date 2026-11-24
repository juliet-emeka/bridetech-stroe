import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react'
import {
  Badge,
  Button,
  Container,
  EmptyState,
  LoadingState,
  SectionHeading,
} from '../../components/common'
import ProductImage from '../../components/products/ProductImage'
import ProductGrid from '../../components/products/ProductGrid'
import ProductReviews from '../../components/reviews/ProductReviews'
import QuantitySelector from '../../components/cart/QuantitySelector'
import { useCart } from '../../context/useCart'
import { useCategories, useCollection, useProduct } from '../../hooks/useCatalogue'
import { formatCurrency, getRelatedProducts } from '../../services/catalogue'

export default function ProductDetails() {
  const { slug } = useParams()
  const productState = useProduct(slug)
  const categories = useCategories()
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  const { addItem } = useCart()
  const product = productState.data

  const relatedLoader = useCallback(
    (limit) =>
      product ? getRelatedProducts(product, limit) : Promise.resolve([]),
    [product],
  )
  const related = useCollection(relatedLoader, 4)

  if (productState.loading) return <LoadingState label="Loading product…" />

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product is no longer listed or the link is incorrect."
        action={<Button to="/shop">Back to shop</Button>}
      />
    )
  }

  const outOfStock =
    product.availabilityStatus === 'out_of_stock' || product.stockQuantity < 1
  const category = categories.data?.find(
    (item) => item.id === product.categoryId,
  )
  const maxQuantity = outOfStock ? 1 : product.stockQuantity
  const safeQuantity = Math.min(quantity, maxQuantity)

  const handleAdd = () => {
    const added = addItem(product, safeQuantity)
    setNotice(
      added
        ? `${safeQuantity} × ${product.name} added to your cart.`
        : 'This product is currently unavailable.',
    )
  }

  return (
    <Container className="py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-brand-navy/50">
        <Link to="/" className="hover:text-brand-primary">Home</Link>
        <ChevronRight className="size-3" aria-hidden="true" />
        <Link to="/shop" className="hover:text-brand-primary">Shop</Link>
        <ChevronRight className="size-3" aria-hidden="true" />
        <Link
          to={`/shop?category=${category?.slug ?? ''}`}
          className="hover:text-brand-primary"
        >
          {category?.name ?? 'Product'}
        </Link>
        <ChevronRight className="size-3" aria-hidden="true" />
        <span className="font-semibold text-brand-navy">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="surface-blue relative aspect-square overflow-hidden">
            <ProductImage src={product.imageUrl} alt={product.name} />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {product.isNewArrival && <Badge tone="sky">New arrival</Badge>}
              {product.originalPrice && <Badge tone="navy">Special offer</Badge>}
              {outOfStock && <Badge tone="outline">Out of stock</Badge>}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
            {product.brand ?? 'Brand to be confirmed'}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-brand-navy/50">
            {category?.name ?? 'Category to be confirmed'}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold text-brand-navy">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-brand-navy/40 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-brand-navy/70">
            {product.description}
          </p>

          <div className="mt-7">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <PackageCheck className="size-4 text-brand-primary" aria-hidden="true" />
              {outOfStock
                ? 'Currently out of stock'
                : `Available — ${product.stockQuantity} in stock`}
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-xs text-brand-navy/55">
              <ShieldCheck className="size-4 text-brand-primary" aria-hidden="true" />
              Product information is supplied by the store administrator.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!outOfStock && (
              <QuantitySelector
                value={safeQuantity}
                max={product.stockQuantity}
                onChange={setQuantity}
                label={product.name}
              />
            )}
            <Button onClick={handleAdd} size="lg" disabled={outOfStock}>
              <ShoppingCart className="size-4" aria-hidden="true" />
              Add to cart
            </Button>
            <Button to="/contact" variant="outline" size="lg">
              <MessageCircle className="size-4" aria-hidden="true" />
              Enquire
            </Button>
          </div>

          {notice && (
            <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-primary">
              <Check className="size-4" aria-hidden="true" />
              {notice}
            </p>
          )}

          {product.specifications?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-bold text-brand-navy">Specifications</h2>
              <dl className="mt-3 divide-y divide-brand-light rounded-xl border border-brand-light">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <dt className="text-brand-navy/60">{spec.label}</dt>
                    <dd className="text-right font-semibold text-brand-navy">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      <ProductReviews product={product} />

      {!related.loading && related.data?.length > 0 && (
        <section className="mt-16 border-t border-brand-light pt-12">
          <SectionHeading eyebrow="You may also like" title="Related products" />
          <div className="mt-8">
            <ProductGrid products={related.data} />
          </div>
        </section>
      )}
    </Container>
  )
}
