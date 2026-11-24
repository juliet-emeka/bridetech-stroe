import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Container, Logo, SocialLinks } from '../common'
import {
  navigation,
  placeholderText,
  siteConfig,
  supportLinks,
} from '../../config/site'

const footerLink =
  'inline-block py-1.5 text-sm text-white/70 transition hover:text-brand-sky'
const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t-4 border-brand-primary bg-brand-navy text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            {siteConfig.description}
          </p>
          <SocialLinks variant="dark" className="mt-5" />
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-sky">
            Explore
          </h3>
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-sky">
            Support
          </h3>
          <ul>
            {supportLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-sky">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-sky" aria-hidden="true" />
              <span>{siteConfig.phones.join('  •  ')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-sky" aria-hidden="true" />
              <span>{siteConfig.email ?? placeholderText}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-sky" aria-hidden="true" />
              <span>{siteConfig.address ?? placeholderText}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/admin" className="transition hover:text-white">Admin</Link>
            <p>Order by WhatsApp.</p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
