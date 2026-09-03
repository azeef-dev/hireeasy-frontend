import { Routes, Route, useLocation, matchPath } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderDetails from './pages/ProviderDetails';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

const KNOWN_ROUTES = [
  '/',
  '/login',
  '/register',
  '/providers/:id',
  '/dashboard',
  '/provider/dashboard',
  '/admin/dashboard',
  '/about',
  '/contact',
  '/how-it-works',
  '/faq',
];

export default function App() {
  const location = useLocation();
  const isKnownRoute = KNOWN_ROUTES.some((path) => matchPath(path, location.pathname));

  return (
    <div className="flex min-h-screen flex-col bg-brand-paper">
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#0F9B8E', secondary: '#fff' } },
          error: { iconTheme: { primary: '#F0553F', secondary: '#fff' } },
        }}
      />
      {isKnownRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['user']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/dashboard"
            element={
              <ProtectedRoute roles={['provider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {isKnownRoute && <Footer />}
    </div>
  );
}