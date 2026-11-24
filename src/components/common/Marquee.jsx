const offers = [
  'Smartphones',
  'Laptops & Computers',
  'Gaming Consoles',
  'Smart Devices',
  'Phone Accessories',
  'Laptop Accessories',
  'Quality Gadgets',
  'WhatsApp Ordering',
  'Direct Support',
  'Trusted Service',
]

export default function Marquee() {
  return (
    <div
      className="marquee-mask relative z-10 border-y border-brand-light bg-brand-white py-3 shadow-[0_10px_30px_rgba(32,32,48,0.12)]"
      aria-label="Products and services offered by BRIDETECH STORE"
    >
      <div className="marquee-track flex w-max items-center">
        {[...offers, ...offers].map((offer, index) => (
          <span
            key={`${offer}-${index}`}
            aria-hidden={index >= offers.length ? 'true' : undefined}
            className="flex shrink-0 items-center px-3"
          >
            <span className="font-hero rounded-pill border border-brand-primary/25 bg-brand-white px-4 py-1.5 text-sm font-bold uppercase tracking-[0.18em] text-brand-primary shadow-[0_4px_12px_rgba(0,112,240,0.12)]">
              {offer}
            </span>
            <span className="ml-6 h-5 w-px bg-brand-primary/20" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  )
}
