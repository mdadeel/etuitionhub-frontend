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
// rutes setup
let App = () => {
  console.log('app rendering')

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tuitions" element={<Tuitions />} />
              <Route path="/tutors" element={<Tutors />} />
// <Route path="/tutor/:id" element={<TutorDetails />} />
              <Route path="/tutor/:id" element={<TutorDetails />} />
              <Route path="/tuition/:id" element={<TuitionDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />


              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

              <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/checkout/:id" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
// <Route path="/payment-history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />
              <Route path="/payment-history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />



              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />

          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
