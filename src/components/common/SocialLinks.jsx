import { siteConfig } from '../../config/site'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path d="M16.5 2c.28 2.33 1.7 3.94 4 4.23v3.05c-1.5.05-2.85-.42-4-1.27v6.49c0 3.31-2.38 5.5-5.25 5.5A5.27 5.27 0 0 1 6 14.72c0-3.1 2.57-5.45 5.68-5.18v3.15c-1.45-.33-2.63.72-2.63 2.03 0 1.18.91 2.05 2.07 2.05 1.22 0 2.13-.92 2.13-2.35V2h3.25Z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15.02L2 22l5.1-1.5A9.9 9.9 0 1 0 12.04 2Zm0 2a7.9 7.9 0 0 1 0 15.8c-1.3 0-2.56-.32-3.67-.92l-.26-.14-3.03.89.9-2.95-.15-.27A7.9 7.9 0 0 1 12.04 4Zm-3.4 3.8c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.7 4.13 3.68 2.02.82 2.43.66 2.87.62.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46Z" />
    </svg>
  )
}

const links = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { key: 'whatsappChannel', label: 'WhatsApp channel', Icon: WhatsAppIcon },
]

export default function SocialLinks({ variant = 'light', className = '' }) {
  const activeLinks = links.filter(({ key }) => siteConfig.social?.[key])
  if (!activeLinks.length) return null

  const linkClass =
    variant === 'dark'
      ? 'border-white/15 text-white/70 hover:border-brand-sky hover:bg-white/5 hover:text-brand-sky'
      : 'border-brand-light text-brand-navy/55 hover:border-brand-primary hover:bg-brand-light hover:text-brand-primary'

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {activeLinks.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={siteConfig.social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (opens in a new tab)`}
            title={label}
            className={`inline-flex size-10 items-center justify-center rounded-full border transition ${linkClass}`}
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  )
}
