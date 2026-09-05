import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Users, Wrench, CalendarCheck, Star, Clock, ShieldCheck, ShieldOff, ArrowRight } from 'lucide-react';
import { getDashboardStats } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';

const STATUS_STYLES = {
    pending: 'bg-brand-marigold/15 text-[#a35e00]',
    accepted: 'bg-brand-teal/15 text-brand-teal',
    'in-progress': 'bg-brand-indigo/10 text-brand-indigo',
    completed: 'bg-brand-teal text-white',
    rejected: 'bg-brand-coral/15 text-brand-coral',
};

export default function AdminOverview() {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'superadmin';
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    const statCards = stats
        ? [
            { label: 'Total customers', value: stats.totalUsers, Icon: Users, color: '#2B2F79' },
            { label: 'Total providers', value: stats.totalProviders, Icon: Wrench, color: '#0F9B8E' },
            { label: 'Pending verification', value: stats.pendingProviders, Icon: Clock, color: '#FFB020' },
            { label: 'Inactive providers', value: stats.inactiveProviders, Icon: ShieldOff, color: '#F0553F' },
            { label: 'Total bookings', value: stats.totalBookings, Icon: CalendarCheck, color: '#F0553F' },
            { label: 'Total reviews', value: stats.totalReviews, Icon: Star, color: '#FFB020' },
            ...(isSuperAdmin && stats.totalAdmins !== undefined
                ? [{ label: 'Admin accounts', value: stats.totalAdmins, Icon: ShieldCheck, color: '#2B2F79' }]
                : []),
        ]
        : [];

    return (
        <div>
            <h1 className="text-2xl font-bold text-brand-ink">Overview</h1>
            <p className="mt-1 text-sm text-brand-ink/50">A snapshot of everything happening on HireEasy.</p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {loading
                    ? Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} height={90} borderRadius={16} />)
                    : statCards.map((s) => (
                        <div key={s.label} className="rounded-2xl bg-white p-4 shadow-sm">
                            <span
                                className="flex h-9 w-9 items-center justify-center rounded-full"
                                style={{ backgroundColor: `${s.color}1A` }}
                            >
                                <s.Icon size={17} style={{ color: s.color }} strokeWidth={1.8} />
                            </span>
                            <p className="mt-3 text-xl font-bold text-brand-ink">{s.value}</p>
                            <p className="mt-0.5 text-xs text-brand-ink/50">{s.label}</p>
                        </div>
                    ))}
            </div>

            {!loading && stats && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {Object.entries(stats.bookingsByStatus).map(([status, count]) => (
                        <div key={status} className="rounded-2xl bg-white p-4 shadow-sm">
                            <span
                                className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[status]}`}
                            >
                                {status.replace('-', ' ')}
                            </span>
                            <p className="mt-2 text-lg font-bold text-brand-ink">{count}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-brand-ink">Recent bookings</p>
                        <Link
                            to="/admin/dashboard/bookings"
                            className="flex items-center gap-1 text-xs font-semibold text-brand-indigo hover:underline"
                        >
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="mt-3 flex flex-col gap-2.5">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={44} borderRadius={12} />)
                        ) : stats?.recentBookings?.length ? (
                            stats.recentBookings.map((b) => (
                                <div
                                    key={b._id}
                                    className="flex items-center justify-between rounded-xl bg-brand-paper px-3.5 py-2.5"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-brand-ink">{b.service}</p>
                                        <p className="truncate text-xs text-brand-ink/50">
                                            {b.customer?.name || 'Deleted user'} → {b.provider?.name || 'Deleted provider'}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${STATUS_STYLES[b.status]}`}
                                    >
                                        {b.status.replace('-', ' ')}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-center text-sm text-brand-ink/45">No bookings yet</p>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-brand-ink">Pending provider verifications</p>
                        <Link
                            to="/admin/dashboard/providers"
                            className="flex items-center gap-1 text-xs font-semibold text-brand-indigo hover:underline"
                        >
                            Review <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="mt-3 flex flex-col gap-2.5">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={44} borderRadius={12} />)
                        ) : stats?.recentPendingProviders?.length ? (
                            stats.recentPendingProviders.map((p) => (
                                <div
                                    key={p._id}
                                    className="flex items-center justify-between rounded-xl bg-brand-paper px-3.5 py-2.5"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-brand-ink">{p.name}</p>
                                        <p className="truncate text-xs text-brand-ink/50">
                                            {p.serviceCategory} · {p.location || 'No location'}
                                        </p>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-brand-marigold/15 px-2.5 py-1 text-[10px] font-semibold text-[#a35e00]">
                                        Pending
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-center text-sm text-brand-ink/45">Nothing pending</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}