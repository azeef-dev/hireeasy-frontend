import { Routes, Route, useLocation, matchPath } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import ProviderDetails from './pages/ProviderDetails';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProviders from './pages/admin/AdminProviders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAdmins from './pages/admin/AdminAdmins';

const KNOWN_ROUTES = [
  '/',
  '/login',
  '/register',
  '/reset-password/:token',
  '/providers/:id',
  '/dashboard',
  '/provider/dashboard',
  '/about',
  '/contact',
  '/how-it-works',
  '/faq',
];

export default function App() {
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin');
  const isKnownRoute = isAdminSection || KNOWN_ROUTES.some((path) => matchPath(path, location.pathname));

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
      {isKnownRoute && !isAdminSection && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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

          {/* ── Hidden admin entrance: type /admin in the URL bar ── */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* ── Admin & Super Admin panel (own layout, no site navbar/footer) ── */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['admin', 'superadmin']} redirectTo="/admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="providers" element={<AdminProviders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route
              path="admins"
              element={
                <ProtectedRoute roles={['superadmin']} redirectTo="/admin">
                  <AdminAdmins />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {isKnownRoute && !isAdminSection && <Footer />}
    </div>
  );
}