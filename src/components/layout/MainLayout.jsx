import { Outlet, useLocation } from 'react-router-dom'
import { DemoNotice } from '../common'
import Header from './Header'
import Footer from './Footer'

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-brand-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-pill focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <DemoNotice />
        <main id="main-content" className="flex-1">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>

      <Footer />
    </div>
  )
}
