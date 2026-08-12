import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BookingModal from './components/booking/BookingModal'
import ChatWidget from './components/chat/ChatWidget'
import Toaster from './components/ui/Toaster'
import Home from './pages/Home'

const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const About = lazy(() => import('./pages/About'))
const ServiceAreaPage = lazy(() => import('./pages/ServiceAreaPage'))
const Financing = lazy(() => import('./pages/Financing'))
const Contact = lazy(() => import('./pages/Contact'))
const Book = lazy(() => import('./pages/Book'))

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Bookings = lazy(() => import('./pages/admin/Bookings'))
const BookingDetail = lazy(() => import('./pages/admin/BookingDetail'))
const CalendarPage = lazy(() => import('./pages/admin/CalendarPage'))
const Leads = lazy(() => import('./pages/admin/Leads'))
const Customers = lazy(() => import('./pages/admin/Customers'))
const Conversations = lazy(() => import('./pages/admin/Conversations'))
const KnowledgeBase = lazy(() => import('./pages/admin/KnowledgeBase'))
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin'))
const ContentPage = lazy(() => import('./pages/admin/ContentPage'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 sm:px-6 py-3 sm:py-6 min-h-screen">
      <div className="sheet max-w-[1440px] mx-auto overflow-clip relative">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
      <BookingModal />
      <ChatWidget />
    </div>
  )
}

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="font-display text-xs tracking-[0.4em] uppercase text-navy-900/30">Loading…</p>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/services/:slug" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/service-area" element={<PublicLayout><ServiceAreaPage /></PublicLayout>} />
          <Route path="/financing" element={<PublicLayout><Financing /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/book" element={<PublicLayout><Book /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="leads" element={<Leads />} />
            <Route path="customers" element={<Customers />} />
            <Route path="conversations" element={<Conversations />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  )
}
