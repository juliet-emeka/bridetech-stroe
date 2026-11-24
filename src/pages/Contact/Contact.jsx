import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { SocialLinks } from '../../components/common'
import InfoPage, { InfoSection } from '../../components/common/InfoPage'
import { placeholderText, siteConfig } from '../../config/site'

export default function Contact() {
  return (
    <InfoPage
      eyebrow="Get in touch"
      title="Contact us"
      description="Reach the store directly with questions about products, availability or orders."
    >
      <InfoSection title="Telephone">
        <ul className="space-y-2">
          {siteConfig.phones.map((phone) => (
            <li key={phone} className="flex items-center gap-2">
              <Phone className="size-4 text-brand-primary" aria-hidden="true" />
              <a href={`tel:${phone}`} className="font-semibold text-brand-primary hover:underline">
                {phone}
              </a>
            </li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Other contact details">
        <p className="flex items-center gap-2">
          <Mail className="size-4 text-brand-primary" aria-hidden="true" />
          Email: {siteConfig.email ?? placeholderText}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="size-4 text-brand-primary" aria-hidden="true" />
          Address: {siteConfig.address ?? placeholderText}
        </p>
      </InfoSection>

      {Object.values(siteConfig.social).some(Boolean) && (
        <InfoSection title="Social media">
          <p className="mb-3">Follow the store on social media:</p>
          <SocialLinks />
        </InfoSection>
      )}

      <InfoSection title="WhatsApp">
        <p className="flex items-start gap-2">
          <MessageCircle className="mt-0.5 size-4 shrink-0 text-brand-primary" aria-hidden="true" />
          WhatsApp checkout is configured. Use the checkout flow to send your
          order with the details prefilled. Telephone numbers above should not
          be assumed to be WhatsApp-enabled.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
