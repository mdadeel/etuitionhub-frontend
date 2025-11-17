// Main App component - routing and stuff setup
// layout configure kortesi ekhane
// TODO: refactor this later maybe
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tuitions from './pages/Tuitions';
import Tutors from './pages/Tutors';
import TutorDetails from './pages/TutorDetails';
import TuitionDetails from './pages/TuitionDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentHistory from './pages/PaymentHistory'
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/shared/PrivateRoute';
import PublicRoute from './components/shared/PublicRoute';

// TODO: add more routes as needed
// TODO: maybe split this into separate file
// FIXME: too many imports ekhanebana
function App() {
  // app render hocche
  // TODO: add loading state maybe?

  return (
    // auth provider diye wrap kortesi
    <AuthProvider>
      {/* browser router use kortesi */}
      <BrowserRouter>
        {/* main layout container */}
        <div className="min-h-screen flex flex-col">
          {/* top navbar */}
          <Navbar />

          {/* main content area */}
          <main className="flex-grow">
            {/* sob routes ekhane define kortesi */}
            <Routes>
              {/* public routes - keu access korte parbe */}
              {/* homepage route */}
              <Route path="/" element={<Home />} />

              {/* tuitions list route */}
              <Route path="/tuitions" element={<Tuitions />} />

              {/* tutors list route */}
              <Route path="/tutors" element={<Tutors />} />

              {/* single tutor details route */}
              <Route path="/tutor/:id" element={<TutorDetails />} />

              {/* single tuition details route */}
              <Route path="/tuition/:id" element={<TuitionDetails />} />

              {/* about us page route */}
              <Route path="/about" element={<About />} />

              {/* contact us page route */}
              <Route path="/contact" element={<Contact />} />

              {/* auth routes - already logged in hole home e redirect */}
              {/* wrapped with PublicRoute */}
              {/* login page route */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

              {/* registration page route */}
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

              {/* protected routes - login lagbe access korte */}
              {/* wrapped with PrivateRoute */}
              {/* dashboard main route - nested routes ase */}
              <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

              {/* checkout route - payment er jonno */}
              <Route path="/checkout/:id" element={<PrivateRoute><Checkout /></PrivateRoute>} />

              {/* payment success page route */}
              <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

              {/* payment history page route */}
              <Route path="/payment-history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />



              {/* 404 route - kono route match na korle */}
              {/* wildcard diye catch kortesi */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* bottom footer */}
          <Footer />

          {/* global toast notifications */}
          {/* top right corner e show hobe */}
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// default export
export default App;
