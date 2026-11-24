import InfoPage, { InfoSection } from '../../components/common/InfoPage'
import {  siteConfig } from '../../config/site'

export default function Returns() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Returns & refunds"
      description="The final policy will be supplied by the business."
    >
      <InfoSection title="Current policy">

        < p>
          Return window: All return or exchange requests must be reported within 24 hours after delivery or collection of the product.
        </p>

        <p>
          Eligible products and conditions: Products may qualify for an exchange or replacement under the following conditions:

          Items must be unused and returned in their original packaging, where applicable.

          Products received with manufacturing defects or faults must be reported within 24 hours.

          Wrong products, models, or specifications supplied by BRIDETECH STORE are eligible for exchange.

          Products with missing accessories or components originally included in the purchase may be reported for resolution.
        </p>
        
        <p>
          Refund method and processing time: BRIDETECH STORE operates a strict no-refund policy. We do not offer monetary refunds after payment has been made. However, if a product is confirmed to be defective or faulty, we will provide an appropriate resolution through repair, replacement of the affected part, or exchange for a new product where necessary. All claims are subject to inspection and verification.

        </p>
      </InfoSection>

      <InfoSection title="Requesting a return">
        <p>
          Contact the store using {siteConfig.phones.join(' or ')} and provide
          your order details. The store will confirm the next steps directly.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
