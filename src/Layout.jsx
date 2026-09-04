import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import CardGlow from './components/CardGlow.jsx'
import SectionRules from './components/SectionRules.jsx'
import MobileCtaBar from './components/MobileCtaBar.jsx'
import FloatingCall from './components/FloatingCall.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <CardGlow />
      <SectionRules />
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <MobileCtaBar />
      <FloatingCall />
      {/* Clearance for the sticky mobile bar. */}
      <div className="h-[78px] lg:hidden" aria-hidden="true" />
    </AuthProvider>
  )
}
