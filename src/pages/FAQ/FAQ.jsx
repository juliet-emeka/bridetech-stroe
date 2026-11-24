import InfoPage, { InfoSection } from '../../components/common/InfoPage'

const questions = [
  {
    question: 'How do I place an order?',
    answer:
      'Add the products you want to your cart, open checkout, enter your name, phone number and delivery information, then review the order. WhatsApp checkout will be available.',
  },
  {
    question: 'Is my order confirmed when WhatsApp opens?',
    answer:
      'No. You must send the prepared message and wait for the store to confirm the order and any delivery charges.',
  },
  {
    question: 'How do I know if a product is available?',
    answer:
      'Availability and stock quantity are shown on each product page and on product cards. Products marked out of stock cannot be added to the cart.',
  },
  {
    question: 'Can product prices change?',
    answer:
      'Prices are managed by the store administrator. The total shown at checkout is based on the prices in your cart at that time and is confirmed by the store.',
  },
  {
    question: 'What are the delivery charges and timeframes?',
    answer:  ' Please read the delivery information or contact the store for the current policy.',
  },
  {
    question: 'What is the return or refund policy?',
    answer: ` Please read the Returns & Refunds page or contact the store for the current policy.`,
  },
]

export default function FAQ() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Frequently asked questions"
      description="Answers about browsing products, availability and ordering."
    >
      {questions.map(({ question, answer }) => (
        <InfoSection key={question} title={question}>
          <p>{answer}</p>
        </InfoSection>
      ))}
    </InfoPage>
  )
}
