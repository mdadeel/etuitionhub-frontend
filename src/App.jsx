// main app comp
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from './components/shared/Navbar'
import { Toaster } from 'react-hot-toast'
import Home from "./pages/Home"
import Footer from './components/shared/Footer'
import Login from "./pages/Login"
import Register from './pages/Register'
import Tuitions from "./pages/Tuitions"
import Tutors from './pages/Tutors'
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from './contexts/ThemeContext'
import Blog from './pages/Blog'
import TutorDetails from './pages/TutorDetails'
import TuitionDetails from "./pages/TuitionDetails"
import About from './pages/About'
import Contact from "./pages/Contact"
import Dashboard from './pages/Dashboard'
import PrivateRoute from "./components/shared/PrivateRoute"
import PublicRoute from './components/shared/PublicRoute'
import NotFound from "./pages/NotFound"
import Checkout from './pages/Checkout'
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentHistory from './pages/PaymentHistory'
import AdminLogin from './pages/AdminLogin'

// rutes setup
let App = () => {
  console.log('app rendering')

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tuitions" element={<Tuitions />} />
                <Route path="/tutors" element={<Tutors />} />

                <Route path="/tutor/:id" element={<TutorDetails />} />
                <Route path="/tuition/:id" element={<TuitionDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />


                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/checkout/:id" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
                {/* <Route path="/payment-history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} /> */}
                <Route path="/payment-history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />
                {/* <Route path="/test-layout" element={<TestLayout />} /> */}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />

            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
