import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Search, Trash2 } from 'lucide-react';
import { getAdminReviews, deleteAdminReview } from '../../api/admin';
import FilterDropdown from '../../components/FilterDropdown';
import Modal from '../../components/Modal';
import StarRating from '../../components/StarRating';

const RATING_OPTIONS = [
    { id: '5', label: '5 stars' },
    { id: '4', label: '4 stars' },
    { id: '3', label: '3 stars' },
    { id: '2', label: '2 stars' },
    { id: '1', label: '1 star' },
];

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [rating, setRating] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchReviews = useCallback(() => {
        setLoading(true);
        getAdminReviews({ search: search || undefined, rating: rating || undefined })
            .then(setReviews)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, [search, rating]);

    useEffect(() => {
        const t = setTimeout(fetchReviews, 300);
        return () => clearTimeout(t);
    }, [fetchReviews]);

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteAdminReview(deleteTarget._id);
            toast.success('Review deleted');
            setDeleteTarget(null);
            fetchReviews();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold text-brand-ink">Reviews</h1>
                <p className="mt-1 text-sm text-brand-ink/50">Moderate reviews left across the platform.</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/35" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by customer, provider, comment..."
                        className="w-full rounded-full border border-brand-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:border-brand-marigold focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                    />
                </div>
                <FilterDropdown label="Rating" value={rating} options={RATING_OPTIONS} onChange={setRating} />
            </div>

            <div className="mt-5 flex flex-col gap-3">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={90} borderRadius={16} />)
                ) : reviews.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-14 text-center text-sm text-brand-ink/50">
                        No reviews match these filters
                    </div>
                ) : (
                    reviews.map((r) => (
                        <div key={r._id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-brand-ink">{r.customer?.name || 'Deleted user'}</p>
                                    <span className="text-brand-ink/30">→</span>
                                    <p className="text-sm text-brand-ink/55">{r.provider?.name || 'Deleted provider'}</p>
                                </div>
                                <div className="mt-1.5">
                                    <StarRating value={r.rating} showValue={false} size={14} />
                                </div>
                                {r.comment && <p className="mt-2 text-sm text-brand-ink/65">{r.comment}</p>}
                            </div>
                            <button
                                onClick={() => setDeleteTarget(r)}
                                className="flex shrink-0 items-center gap-1 rounded-full bg-brand-coral/10 px-3.5 py-2 text-xs font-semibold text-brand-coral hover:bg-brand-coral/20"
                            >
                                <Trash2 size={13} /> Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete review">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-brand-ink/65">
                        Delete this review from{' '}
                        <span className="font-semibold text-brand-ink">{deleteTarget?.customer?.name || 'this customer'}</span>? The
                        provider's rating will be recalculated. This cannot be undone.
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