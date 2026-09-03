import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from '@heroui/react';
import { useAuth } from '../context/AuthContext';

const DASHBOARD_PATH = {
  user: '/dashboard',
  provider: '/provider/dashboard',
  admin: '/admin/dashboard',
  superadmin: '/admin/dashboard',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAction = (key) => {
    if (key === 'dashboard') navigate(DASHBOARD_PATH[user.role]);
    if (key === 'logout') {
      logout();
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-ink/5 bg-brand-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-indigo text-sm font-bold text-white">
            H
          </span>
          <span className="text-lg font-bold tracking-tight text-brand-ink">HireEasy</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-ink/70 sm:flex">
          <Link to="/" className="hover:text-brand-ink">
            Browse providers
          </Link>
          {user?.role === 'user' && (
            <Link to="/dashboard" className="hover:text-brand-ink">
              My bookings
            </Link>
          )}
        </nav>

        {!user ? (
          <div className="flex items-center gap-3">
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
            <Dropdown.Popover className="min-w-[190px] rounded-2xl border border-brand-ink/10 bg-white p-1.5 shadow-lg">
              <Dropdown.Menu onAction={handleAction}>
                <Dropdown.Item
                  id="dashboard"
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm capitalize text-brand-ink data-[hovered]:bg-brand-paper data-[focused]:bg-brand-paper"
                >
                  {user.role === 'user' ? 'My bookings' : `${user.role} dashboard`}
                </Dropdown.Item>
                <Dropdown.Item
                  id="logout"
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm text-brand-coral data-[hovered]:bg-brand-coral/10 data-[focused]:bg-brand-coral/10"
                >
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        )}
      </div>
    </header>
  );
}
