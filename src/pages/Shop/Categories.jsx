import { ArrowRight } from 'lucide-react'
import { Button, Container, LoadingState, SectionHeading } from '../../components/common'
import CategoryCard from '../../components/products/CategoryCard'
import { useCategories, useCategoryCounts } from '../../hooks/useCatalogue'

export default function Categories() {
  const categories = useCategories()
  const counts = useCategoryCounts()

  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading
        eyebrow="Catalogue"
        title="Product categories"
        description="Browse the types of gadgets and electronics stocked by the store."
      />

      {categories.loading || counts.loading ? (
        <LoadingState label="Loading categories…" />
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.data?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={counts.data?.[category.id] ?? 0}
            />
          ))}
        </div>
      )}

      <div className="mt-12">
        <Button to="/shop" variant="outline">
          Browse all products
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </Container>
  )
}
