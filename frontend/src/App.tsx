import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ToastContainer } from './components/ui/Toast'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { BookingPage } from './pages/BookingPage'
import { ReviewsPage } from './pages/ReviewsPage'

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
