import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { Button, Input } from '../common'

const selectClass =
  'h-11 w-full rounded-xl border border-brand-light bg-brand-white px-3.5 text-sm text-brand-navy transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20'

export default function CatalogueFilters({ filters, categories, onChange, onReset }) {
  const set = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="surface-blue p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-brand-navy">
        <SlidersHorizontal className="size-4 text-brand-primary" aria-hidden="true" />
        Refine products
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Input
            label="Search"
            type="search"
            placeholder="Search by product name or brand"
            value={filters.search}
            onChange={(event) => set('search', event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category-filter" className="mb-1.5 block text-sm font-semibold text-brand-navy">
            Category
          </label>
          <select
            id="category-filter"
            className={selectClass}
            value={filters.category}
            onChange={(event) => set('category', event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort-filter" className="mb-1.5 block text-sm font-semibold text-brand-navy">
            Sort by
          </label>
          <select
            id="sort-filter"
            className={selectClass}
            value={filters.sort}
            onChange={(event) => set('sort', event.target.value)}
          >
            <option value="newest">Newest arrivals</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        <Input
          label="Minimum price"
          type="number"
          min="0"
          placeholder="0"
          value={filters.minPrice}
          onChange={(event) => set('minPrice', event.target.value)}
        />
        <Input
          label="Maximum price"
          type="number"
          min="0"
          placeholder="Any"
          value={filters.maxPrice}
          onChange={(event) => set('maxPrice', event.target.value)}
        />

        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-2">
          <Button variant="ghost" size="md" onClick={onReset} className="w-full">
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear filters
          </Button>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-brand-navy/50">
        <Search className="size-3.5" aria-hidden="true" />
        Filters apply instantly as you type.
      </p>
    </div>
  )
}
