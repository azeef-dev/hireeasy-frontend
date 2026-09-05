import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Wrench,
    Users,
    CalendarCheck,
    Star,
    ShieldCheck,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { to: '/admin/dashboard', label: 'Overview', Icon: LayoutDashboard, end: true },
    { to: '/admin/dashboard/providers', label: 'Providers', Icon: Wrench },
    { to: '/admin/dashboard/customers', label: 'Customers', Icon: Users },
    { to: '/admin/dashboard/bookings', label: 'Bookings', Icon: CalendarCheck },
    { to: '/admin/dashboard/reviews', label: 'Reviews', Icon: Star },
];

const SUPERADMIN_ITEM = { to: '/admin/dashboard/admins', label: 'Admins', Icon: ShieldCheck };

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isSuperAdmin = user?.role === 'superadmin';
    const items = isSuperAdmin ? [...NAV_ITEMS, SUPERADMIN_ITEM] : NAV_ITEMS;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-marigold text-brand-ink' : 'text-white/65 hover:bg-white/5 hover:text-white'
        }`;

    const SidebarNav = ({ onNavigate }) => (
        <>
            <div className="flex items-center gap-2 px-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-marigold text-base font-bold text-brand-ink">
                    H
                </span>
                <div>
                    <p className="text-sm font-bold text-white">HireEasy</p>
                    <p className="text-[11px] text-white/50">{isSuperAdmin ? 'Super Admin' : 'Admin'} Panel</p>
                </div>
            </div>

            <nav className="mt-8 flex flex-1 flex-col gap-1">
                {items.map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className={linkClass}>
                        <item.Icon size={17} strokeWidth={1.8} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto border-t border-white/10 pt-4">
                <div className="flex items-center gap-2.5 px-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-indigo text-sm font-semibold text-white">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                        <p className="truncate text-[11px] text-white/50">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-brand-coral/90 transition hover:bg-brand-coral/10"
                >
                    <LogOut size={16} />
                    Log out
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-brand-paper">
            {/* ── Desktop sidebar ── */}
            <aside className="hidden w-64 shrink-0 flex-col bg-brand-ink px-4 py-6 lg:flex">
                <SidebarNav />
            </aside>

            {/* ── Mobile drawer ── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="flex w-72 flex-col bg-brand-ink px-4 py-6">
                        <div className="mb-2 flex items-center justify-end px-2">
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
                                aria-label="Close menu"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <SidebarNav onNavigate={() => setMobileOpen(false)} />
                    </div>
                    <div className="flex-1 bg-brand-ink/40" onClick={() => setMobileOpen(false)} />
                </div>
            )}

            {/* ── Right column ── */}
            <div className="flex flex-1 flex-col">
                <header className="flex items-center justify-between border-b border-brand-ink/8 bg-white px-4 py-3 lg:hidden">
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-ink text-sm font-bold text-white">
                            H
                        </span>
                        <p className="text-sm font-bold text-brand-ink">{isSuperAdmin ? 'Super Admin' : 'Admin'} Panel</p>
                    </div>
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-brand-ink"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                </header>

                <main className="flex-1">
                    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}