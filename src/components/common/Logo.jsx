import brandLogo from '../../assets/brand-logo.png'
import { siteConfig } from '../../config/site'

export default function Logo({ src, className = '' }) {
  return (
    <img
      src={src ?? brandLogo}
      alt={siteConfig.name}
      className={`h-10 w-auto object-contain ${className}`}
    />
  )
}
