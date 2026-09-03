import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyBookings } from '../api/bookings';
import { createReview } from '../api/reviews';
import BookingCard from '../components/BookingCard';
import FilterDropdown from '../components/FilterDropdown';
import Modal from '../components/Modal';
import Skeleton from 'react-loading-skeleton';

const STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected' },
];

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    getMyBookings()
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(fetchBookings, [fetchBookings]);

  const filtered = statusFilter ? bookings.filter((b) => b.status === statusFilter) : bookings;

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReview({ booking: reviewTarget._id, rating, comment });
      toast.success('Thanks for the review!');
      setReviewedIds((prev) => new Set(prev).add(reviewTarget._id));
      setReviewTarget(null);
      setRating(5);
      setComment('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">My bookings</h1>
          <p className="mt-1 text-sm text-brand-ink/50">Track every request from here.</p>
        </div>
        <FilterDropdown label="Status" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={180} borderRadius={20} />)
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-16 text-center">
            <p className="font-medium text-brand-ink">No bookings here yet</p>
            <Link to="/" className="mt-2 inline-block text-sm font-semibold text-brand-indigo">
              Browse providers →
            </Link>
          </div>
        ) : (
          filtered.map((b) => (
            <BookingCard key={b._id} booking={b} counterpartLabel="Provider" counterpartName={b.provider?.name}>
              {b.status === 'completed' && !reviewedIds.has(b._id) && (
                <button
                  onClick={() => setReviewTarget(b)}
                  className="rounded-full bg-brand-marigold px-4 py-2 text-xs font-semibold text-brand-ink transition hover:brightness-105"
                >
                  Leave a review
                </button>
              )}
              {b.status === 'completed' && reviewedIds.has(b._id) && (
                <span className="rounded-full bg-brand-teal/15 px-4 py-2 text-xs font-semibold text-brand-teal">
                  Reviewed
                </span>
              )}
            </BookingCard>
          ))
        )}
      </div>

      <Modal open={!!reviewTarget} onClose={() => setReviewTarget(null)} title="Rate this service">
        <form onSubmit={submitReview} className="flex flex-col gap-4">
          <div>
            <span className="text-sm font-medium text-brand-ink">Your rating</span>
            <div className="mt-2 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className="text-3xl leading-none"
                  aria-label={`${n} star`}
                >
                  <span style={{ color: n <= rating ? '#FFB020' : '#E4E4EC' }}>★</span>
                </button>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Comment (optional)</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="How did it go?"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
