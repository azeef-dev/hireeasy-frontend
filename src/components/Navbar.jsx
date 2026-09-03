import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from '@heroui/react';
import { useAuth } from '../context/AuthContext';

const DASHBOARD_PATH = {
  user: '/dashboard',
  provider: '/provider/dashboard',
  admin: '/admin/dashboard',
  superadmin: '/admin/dashboard',
};

const NAV_LINKS = [
  { label: 'Browse providers', href: '/' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAction = (key) => {
    if (key === 'dashboard') navigate(DASHBOARD_PATH[user.role]);
    if (key === 'logout') {
      logout();
      navigate('/');
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-ink/5 bg-brand-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-indigo text-sm font-bold text-white">
            H
          </span>
          <span className="text-lg font-bold tracking-tight text-brand-ink">HireEasy</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-ink/70 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`transition hover:text-brand-ink ${location.pathname === link.href ? 'font-semibold text-brand-ink' : ''
                }`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'user' && (
            <Link to="/dashboard" className="hover:text-brand-ink">
              My bookings
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/login" className="text-sm font-medium text-brand-ink/70 hover:text-brand-ink">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-indigo"
              >
                Get started
              </Link>
            </div>
          ) : (
            <Dropdown>
              <Dropdown.Trigger className="flex items-center gap-2 rounded-full border border-brand-ink/10 bg-white py-1 pl-1 pr-3 transition hover:border-brand-ink/25">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-marigold text-sm font-semibold text-brand-ink">
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
                <span className="hidden text-sm font-medium text-brand-ink sm:inline">{user.name?.split(' ')[0]}</span>
              </Dropdown.Trigger>
              <Dropdown.Popover className="min-w-47.5 rounded-2xl border border-brand-ink/10 bg-white p-1.5 shadow-lg">
                <Dropdown.Menu onAction={handleAction}>
                  <Dropdown.Item
                    id="dashboard"
                    className="cursor-pointer rounded-xl px-3 py-2 text-sm capitalize text-brand-ink data-hovered:bg-brand-paper data-focused:bg-brand-paper"
                  >
                    {user.role === 'user' ? 'My bookings' : `${user.role} dashboard`}
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="logout"
                    className="cursor-pointer rounded-xl px-3 py-2 text-sm text-brand-coral data-hovered:bg-brand-coral/10 data-focused:bg-brand-coral/10"
                  >
                    Log out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-ink lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-brand-ink/5 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMobile}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${location.pathname === link.href ? 'bg-brand-paper text-brand-ink' : 'text-brand-ink/70 hover:bg-brand-paper'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'user' && (
              <Link
                to="/dashboard"
                onClick={closeMobile}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-brand-ink/70 hover:bg-brand-paper"
              >
                My bookings
              </Link>
            )}
          </nav>
          {!user && (
            <div className="mt-3 flex gap-2 border-t border-brand-ink/5 pt-3 sm:hidden">
              <Link
                to="/login"
                onClick={closeMobile}
                className="flex-1 rounded-full border border-brand-ink/10 py-2.5 text-center text-sm font-semibold text-brand-ink"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={closeMobile}
                className="flex-1 rounded-full bg-brand-ink py-2.5 text-center text-sm font-semibold text-white"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}