import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Search, Trash2, Eye } from 'lucide-react';
import { getAdminBookings, adminUpdateBookingStatus, deleteAdminBooking } from '../../api/admin';
import FilterDropdown from '../../components/FilterDropdown';
import Modal from '../../components/Modal';
import StatusTracker from '../../components/StatusTracker';

const STATUS_OPTIONS = [
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'in-progress', label: 'In progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected' },
];

const STATUS_STYLES = {
    pending: 'bg-brand-marigold/15 text-[#a35e00]',
    accepted: 'bg-brand-teal/15 text-brand-teal',
    'in-progress': 'bg-brand-indigo/10 text-brand-indigo',
    completed: 'bg-brand-teal text-white',
    rejected: 'bg-brand-coral/15 text-brand-coral',
};

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [busyId, setBusyId] = useState(null);

    const [viewTarget, setViewTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchBookings = useCallback(() => {
        setLoading(true);
        getAdminBookings({ status: status || undefined, search: search || undefined })
            .then(setBookings)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, [status, search]);

    useEffect(() => {
        const t = setTimeout(fetchBookings, 300);
        return () => clearTimeout(t);
    }, [fetchBookings]);

    const changeStatus = async (id, newStatus) => {
        setBusyId(id);
        try {
            await adminUpdateBookingStatus(id, newStatus);
            toast.success(`Booking marked as ${newStatus.replace('-', ' ')}`);
            fetchBookings();
            setViewTarget(null);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusyId(null);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteAdminBooking(deleteTarget._id);
            toast.success('Booking deleted');
            setDeleteTarget(null);
            fetchBookings();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold text-brand-ink">Bookings</h1>
                <p className="mt-1 text-sm text-brand-ink/50">Every booking across the platform.</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/35" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by booking ID, service, customer, provider..."
                        className="w-full rounded-full border border-brand-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:border-brand-marigold focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                    />
                </div>
                <FilterDropdown label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
            </div>

            <div className="mt-5 flex flex-col gap-3">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={80} borderRadius={16} />)
                ) : bookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-14 text-center text-sm text-brand-ink/50">
                        No bookings match these filters
                    </div>
                ) : (
                    bookings.map((b) => (
                        <div key={b._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
                            <div className="min-w-0 flex-1">
                                <p className="font-mono text-[11px] text-brand-ink/40">{b.bookingId}</p>
                                <p className="font-semibold text-brand-ink">{b.service}</p>
                                <p className="text-sm text-brand-ink/55">
                                    {b.customer?.name || 'Deleted user'} → {b.provider?.name || 'Deleted provider'}
                                </p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[b.status]}`}>
                                {b.status.replace('-', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewTarget(b)}
                                    className="flex items-center gap-1 rounded-full border border-brand-ink/10 px-3.5 py-2 text-xs font-semibold text-brand-ink hover:border-brand-ink/25"
                                >
                                    <Eye size={13} /> View
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(b)}
                                    className="flex items-center gap-1 rounded-full bg-brand-coral/10 px-3.5 py-2 text-xs font-semibold text-brand-coral hover:bg-brand-coral/20"
                                >
                                    <Trash2 size={13} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Booking details">
                {viewTarget && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="font-mono text-xs text-brand-ink/40">{viewTarget.bookingId}</p>
                            <p className="mt-1 text-lg font-semibold text-brand-ink">{viewTarget.service}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <StatusTracker status={viewTarget.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-brand-ink/45">Customer</p>
                                <p className="font-medium text-brand-ink">{viewTarget.customer?.name || 'Deleted user'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-brand-ink/45">Provider</p>
                                <p className="font-medium text-brand-ink">{viewTarget.provider?.name || 'Deleted provider'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-brand-ink/45">Date</p>
                                <p className="font-medium text-brand-ink">
                                    {viewTarget.date ? new Date(viewTarget.date).toLocaleDateString('en-GB') : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-brand-ink/45">Time</p>
                                <p className="font-medium text-brand-ink">{viewTarget.time}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-brand-ink/45">Location</p>
                                <p className="font-medium text-brand-ink">{viewTarget.location}</p>
                            </div>
                            {viewTarget.description && (
                                <div className="col-span-2">
                                    <p className="text-xs text-brand-ink/45">Description</p>
                                    <p className="text-brand-ink/70">{viewTarget.description}</p>
                                </div>
                            )}
                        </div>

                        {viewTarget.status !== 'completed' && (
                            <div>
                                <p className="mb-2 text-xs font-semibold text-brand-ink/50">Force change status</p>
                                <div className="flex flex-wrap gap-2">
                                    {STATUS_OPTIONS.filter((s) => s.id !== viewTarget.status).map((s) => (
                                        <button
                                            key={s.id}
                                            disabled={busyId === viewTarget._id}
                                            onClick={() => changeStatus(viewTarget._id, s.id)}
                                            className="rounded-full border border-brand-ink/10 px-3.5 py-2 text-xs font-semibold text-brand-ink hover:border-brand-ink/25 disabled:opacity-50"
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete booking">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-brand-ink/65">
                        Are you sure you want to permanently delete booking{' '}
                        <span className="font-mono font-semibold text-brand-ink">{deleteTarget?.bookingId}</span>? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-full border border-brand-ink/10 py-2.5 text-sm font-semibold text-brand-ink">
                            Cancel
                        </button>
                        <button onClick={confirmDelete} disabled={deleting} className="flex-1 rounded-full bg-brand-coral py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                            {deleting ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}