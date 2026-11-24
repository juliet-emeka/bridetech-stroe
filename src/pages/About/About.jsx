import { Button } from '../../components/common'
import InfoPage, { InfoSection } from '../../components/common/InfoPage'
import { placeholderText, siteConfig } from '../../config/site'

export default function About() {
  return (
    <InfoPage
      eyebrow="About us"
      title="About BRIDETECH STORE"
      description="Quality gadgets and electronics, presented clearly and sold with straightforward service."
    >
      <InfoSection title="Who we are">
        <p>
          {siteConfig.name} is a gadget and electronics retail store offering
          smartphones, computers, gaming consoles, smart devices, accessories
          and other electronic products.
        </p>
        <p>
          This website is designed to help customers discover products, check
          prices and product information, build a shopping cart and send an
          order request to the store.
        </p>
      </InfoSection>

      <InfoSection title="How ordering works">
        <p>
          Browse the catalogue, add products to your cart, then review your
          order at checkout. WhatsApp checkout is being prepared and will be
          enabled once the business confirms the number that should receive
          orders. An order is only confirmed after the store responds.
        </p>
      </InfoSection>

      <InfoSection title="Business details">
        <p>Telephone: {siteConfig.phones.join(' • ')}</p>
        <p>Email: {siteConfig.email ?? placeholderText}</p>
        <p>Address: {siteConfig.address ?? placeholderText}</p>
      </InfoSection>

      <Button to="/contact" variant="outline">
        Contact the store
      </Button>
    </InfoPage>
  )
}
