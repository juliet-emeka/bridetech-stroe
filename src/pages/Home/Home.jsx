import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  Headphones,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
  Truck,
} from 'lucide-react'
import {
  Button,
  Container,
  LoadingState,
  Marquee,
  SectionHeading,
} from '../../components/common'
import CategoryCard from '../../components/products/CategoryCard'
import ProductGrid from '../../components/products/ProductGrid'
import { siteConfig } from '../../config/site'
import {
  useCategories,
  useCategoryCounts,
  useCollection,
} from '../../hooks/useCatalogue'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import {
  getFeaturedProducts,
  getNewArrivals,
  getSpecialOffers,
  listPublicPromotions,
} from '../../services/catalogue'
import heroBanner from '../../assets/BTS-hero.jpeg'
import heroImage from '../../assets/hero-section side-image-2.jpg'

const strengths = [
  {
    icon: ShieldCheck,
    title: 'Quality gadgets',
    description: 'Carefully selected electronics and accessories.',
  },
  {
    icon: BadgeCheck,
    title: 'Clear product information',
    description: 'Prices, availability and specifications you can review.',
  },
  {
    icon: Truck,
    title: 'Convenient ordering',
    description: 'Review your cart and send your order by WhatsApp.',
  },
  {
    icon: Headphones,
    title: 'Direct support',
    description: 'Speak with the store using the numbers on this page.',
  },
]

function Hero() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const term = query.trim()
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
  }

  return (
    <section className="relative overflow-hidden bg-brand-gradient text-white">
      <img
        src={heroBanner}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full scale-105 object-cover opacity-45 blur-[2px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-brand-navy/55 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="bg-hero-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="glow-pulse absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl" />
      <div className="glow-pulse anim-delay-200 absolute -bottom-32 left-1/4 size-72 rounded-full bg-brand-sky/20 blur-3xl" />
      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="fade-up font-hero inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em]">
            <Smartphone className="size-3.5" aria-hidden="true" />
            Gadgets • Phones • Accessories
          </p>
          <h1 className="fade-up anim-delay-100 font-hero mt-6 text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Your trusted store for
            <span className="block text-brand-sky">quality gadgets.</span>
          </h1>
          <p className="fade-up anim-delay-200 mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Smartphones, computers, gaming consoles, smart devices and
            accessories — ready to take your orders today.
          </p>

          <form onSubmit={handleSubmit} role="search" className="fade-up anim-delay-300 mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
            <label htmlFor="hero-search" className="sr-only">
              Search products
            </label>
            <div className="flex flex-1 items-center gap-2 rounded-pill bg-white px-4 text-brand-navy shadow-soft">
              <Search className="size-4 shrink-0 text-brand-primary" aria-hidden="true" />
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What are you looking for?"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-brand-navy/40"
              />
            </div>
            <Button type="submit" size="lg" variant="navy" className="shrink-0">
              Search
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>

          <div className="fade-up anim-delay-400 mt-8 flex flex-wrap items-center gap-4 text-sm">
            <Button to="/shop" variant="secondary" size="lg">
              Shop all products
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <a
              href={`tel:${siteConfig.phones[0]}`}
              className="inline-flex items-center gap-2 font-semibold text-white/90 transition hover:text-white"
            >
              <Phone className="size-4" aria-hidden="true" />
              Call the store
            </a>
          </div>
        </div>

        <div className="fade-up anim-delay-300 relative mx-auto w-full max-w-lg">
          <div className="absolute inset-0 -rotate-3 rounded-3xl border border-brand-sky/40 bg-brand-sky/20" />
          <div className="float-soft relative overflow-hidden rounded-3xl bg-white/95 p-3 shadow-2xl ring-4 ring-brand-primary/30">
            <img
              src={heroImage}
              alt="BRIDETECH STORE promotional visual"
              className="aspect-[4/3] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

function ProductSection({ eyebrow, title, description, products, loading, to = '/shop' }) {
  if (loading) return <LoadingState label={`Loading ${title.toLowerCase()}…`} />
  if (!products?.length) return null

  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <Button to={to} variant="outline" size="sm">
            View all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        }
      />
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </Container>
  )
}

export default function Home() {
  const categories = useCategories()
  const counts = useCategoryCounts()
  const featured = useCollection(getFeaturedProducts)
  const arrivals = useCollection(getNewArrivals)
  const offers = useCollection(getSpecialOffers)
  const promotions = useAsyncResource(listPublicPromotions, 'public-promotions')

  return (
    <>
      <Hero />
      <Marquee />

      {promotions.data?.length > 0 && (
        <Container className="pt-14 sm:pt-20">
          <SectionHeading
            eyebrow="Current offers"
            title="Store promotions"
            description="Active offers from BRIDETECH STORE."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.data.map((promotion) => (
              <article key={promotion.id} className="surface-blue p-6">
                <BadgePercent className="size-6 text-brand-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-bold text-brand-navy">
                  {promotion.title}
                </h3>
                <p className="mt-1 text-sm font-extrabold text-brand-primary">
                  {promotion.discountLabel}
                </p>
                {promotion.description && (
                  <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                    {promotion.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </Container>
      )}

      <Container className="py-14 sm:py-20">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          description="Find the right gadget quickly."
        />
        {categories.loading || counts.loading ? (
          <LoadingState label="Loading categories…" />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.data?.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                count={counts.data?.[category.id] ?? 0}
              />
            ))}
          </div>
        )}
      </Container>

      <div className="bg-brand-light/50">
        <ProductSection
          eyebrow="Popular"
          title="Featured products"
          description="A selection of products currently highlighted in the catalogue."
          products={featured.data}
          loading={featured.loading}
        />
      </div>

      <ProductSection
        eyebrow="Just in"
        title="New arrivals"
        description="The latest listings added to the store."
        products={arrivals.data}
        loading={arrivals.loading}
      />

      <div className="bg-brand-light/50">
        <ProductSection
          eyebrow="Offers"
          title="Special offers"
          description="Products with a promotional price, when available."
          products={offers.data}
          loading={offers.loading}
        />
      </div>

      <Container className="py-14 sm:py-20">
        <SectionHeading
          eyebrow="Why shop with us"
          title="A straightforward shopping experience"
          align="center"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="surface-blue p-6 text-center">
              <div className="relative mx-auto w-fit">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-brand-navy text-[10px] font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-brand-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>

      <Container className="pb-16 sm:pb-24">
        <div className="overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white sm:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Contact & WhatsApp
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Need help choosing a gadget?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                Call the store or send your order on WhatsApp. Your cart and
                delivery details are prefilled at checkout, and the store
                confirms availability, delivery and payment.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                {siteConfig.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 rounded-pill bg-white/15 px-4 py-2 transition hover:bg-white/25"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {phone}
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 text-sm">
              <MessageCircle className="size-6" aria-hidden="true" />
              <p className="mt-3 font-semibold">WhatsApp checkout</p>
              <p className="mt-1 text-white/70">
                Review your cart, add your details and send the order straight
                to the store.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
