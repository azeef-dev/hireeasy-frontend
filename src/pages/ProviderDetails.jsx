import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { getProviderById } from '../api/providers';
import { getProviderReviews } from '../api/reviews';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';

export default function ProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ service: '', date: '', time: '', location: '', description: '' });

  useEffect(() => {
    setLoading(true);
    Promise.all([getProviderById(id), getProviderReviews(id)])
      .then(([p, r]) => {
        setProvider(p);
        setReviews(r);
        setForm((f) => ({ ...f, service: p.serviceCategory, location: p.location || '' }));
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const openBooking = () => {
    if (!user) {
      toast('Log in to book a provider', { icon: '🔒' });
      navigate('/login');
      return;
    }
    if (user.role !== 'user') {
      toast.error('Only customer accounts can book services');
      return;
    }
    setModalOpen(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const booking = await createBooking({ provider: id, ...form });
      toast.success(`Booked! Your booking ID is ${booking.bookingId}`);
      setModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-12">
        <Skeleton height={160} borderRadius={20} />
        <Skeleton height={24} width={200} style={{ marginTop: 24 }} />
        <Skeleton height={80} style={{ marginTop: 12 }} />
      </div>
    );
  }

  if (!provider) return null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="overflow-hidden rounded-3xl bg-brand-indigo p-8 text-white">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-brand-indigo">
            {provider.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{provider.name}</h1>
            <p className="text-white/70">
              {provider.serviceCategory} · {provider.location || 'Karachi'}
            </p>
            <div className="mt-2">
              <StarRating value={provider.rating || 0} />
              <span className="ml-2 text-sm text-white/60">({provider.reviewCount || 0} reviews)</span>
            </div>
          </div>
          <button
            onClick={openBooking}
            className="rounded-full bg-brand-marigold px-6 py-3 text-sm font-semibold text-brand-ink transition hover:brightness-105"
          >
            Book now
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-xs text-brand-ink/45">Experience</p>
          <p className="mt-1 text-lg font-bold text-brand-ink">{provider.experience || 0} yrs</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-xs text-brand-ink/45">Starting price</p>
          <p className="mt-1 text-lg font-bold text-brand-ink">
            {provider.price ? `Rs ${provider.price.toLocaleString()}` : 'Ask'}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-xs text-brand-ink/45">Rating</p>
          <p className="mt-1 text-lg font-bold text-brand-ink">{provider.rating ? provider.rating.toFixed(1) : 'New'}</p>
        </div>
      </div>

      {provider.bio && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-brand-ink">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink/65">{provider.bio}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-semibold text-brand-ink">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-brand-ink/50">No reviews yet — be the first to book and review.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r._id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-ink">{r.customer?.name || 'Customer'}</p>
                  <StarRating value={r.rating} showValue={false} size={14} />
                </div>
                {r.comment && <p className="mt-1.5 text-sm text-brand-ink/60">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Book ${provider.name}`}>
        <form onSubmit={handleBook} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Service</span>
            <input
              required
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="input-field"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-brand-ink">Date</span>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-brand-ink">Time</span>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="input-field"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Location</span>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input-field"
              placeholder="Full address"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-field resize-none"
              placeholder="Tell them what needs doing"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50"
          >
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
