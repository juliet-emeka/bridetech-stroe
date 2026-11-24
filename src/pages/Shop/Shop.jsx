import { PackageSearch } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import {
  Button,
  Container,
  EmptyState,
  ErrorState,
  LoadingState,
  SectionHeading,
} from '../../components/common'
import CatalogueFilters from '../../components/products/CatalogueFilters'
import ProductGrid from '../../components/products/ProductGrid'
import { useCategories, useProducts } from '../../hooks/useCatalogue'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const categories = useCategories()

  const filters = {
    search: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? 'newest',
    minPrice: params.get('min') ?? '',
    maxPrice: params.get('max') ?? '',
  }

  const options = {
    search: filters.search,
    category: filters.category,
    sort: filters.sort,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  }
  const products = useProducts(options)

  const updateFilters = (next) => {
    const updated = new URLSearchParams()
    if (next.search.trim()) updated.set('q', next.search.trim())
    if (next.category) updated.set('category', next.category)
    if (next.sort && next.sort !== 'newest') updated.set('sort', next.sort)
    if (next.minPrice) updated.set('min', next.minPrice)
    if (next.maxPrice) updated.set('max', next.maxPrice)
    setParams(updated, { replace: true })
  }

  const resetFilters = () => setParams(new URLSearchParams(), { replace: true })

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow="Catalogue"
        title="Shop all products"
        description="Search, filter and compare the gadgets currently listed by the store."
      />

      <div className="mt-8">
        <CatalogueFilters
          filters={filters}
          categories={categories.data ?? []}
          onChange={updateFilters}
          onReset={resetFilters}
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-brand-navy/60">
          {products.loading
            ? 'Loading products…'
            : `${products.data?.length ?? 0} ${products.data?.length === 1 ? 'product' : 'products'} found`}
        </p>
      </div>

      {products.loading ? (
        <LoadingState label="Loading products…" />
      ) : products.error ? (
        <ErrorState message="Products could not be loaded. Please try again." />
      ) : products.data?.length ? (
        <div className="mt-5">
          <ProductGrid products={products.data} />
        </div>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try a different search term or clear the filters to see all products."
          action={
            <Button onClick={resetFilters} variant="outline">
              Clear filters
            </Button>
          }
        />
      )}
    </Container>
  )
}
