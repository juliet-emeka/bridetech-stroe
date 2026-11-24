import InfoPage, { InfoSection } from '../../components/common/InfoPage'
import {  siteConfig } from '../../config/site'

export default function Delivery() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Delivery information"
      description="How orders are prepared and how delivery details are confirmed."
    >
      <InfoSection title="Placing an order">
        <p>
          Select your products, review the cart and enter your delivery address
          or delivery information during checkout. WhatsApp checkout is pending
          number confirmation, so no order message is sent automatically.
        </p>
      </InfoSection>

      <InfoSection title="Delivery areas, charges and timelines">
        
        <p>Delivery areas: deliver to all states in Nigeria.</p>

        <p>Delivery charges: Charge around Abia state 1000/ 2000.
                    Outside Umuahia is 5000 to 10000.

        </p>

        <p>Estimated delivery time: Within 24hours
          Outside Umuahia 3day </p>

      </InfoSection>

      <InfoSection title="Order confirmation">
        <p>
          The store will confirm availability, delivery charges and the final
          total with you directly. Telephone: {siteConfig.phones.join(' • ')}.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
