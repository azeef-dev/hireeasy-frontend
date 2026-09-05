import { useEffect, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Search, Star, CalendarCheck, Clock } from 'lucide-react';
import { getProviderBookings, updateBookingStatus } from '../api/bookings';
import { getProviderReviews } from '../api/reviews';
import { updateProviderProfile } from '../api/providers';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import FilterDropdown from '../components/FilterDropdown';
import StarRating from '../components/StarRating';

const STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected' },
];

const NEXT_ACTION = {
  accepted: { label: 'Start job', next: 'in-progress' },
  'in-progress': { label: 'Mark completed', next: 'completed' },
};

const TABS = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'profile', label: 'Profile' },
];

export default function ProviderDashboard() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('bookings');

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsFetched, setReviewsFetched] = useState(false);

  const [profile, setProfile] = useState({
    serviceCategory: user?.serviceCategory || '',
    experience: user?.experience || '',
    price: user?.price || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchBookings = useCallback(() => {
    setLoadingBookings(true);
    getProviderBookings()
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoadingBookings(false));
  }, []);

  useEffect(fetchBookings, [fetchBookings]);

  useEffect(() => {
    if (tab === 'reviews' && !reviewsFetched && user?._id) {
      setLoadingReviews(true);
      getProviderReviews(user._id)
        .then(setReviews)
        .catch((err) => toast.error(err.message))
        .finally(() => {
          setLoadingReviews(false);
          setReviewsFetched(true);
        });
    }
  }, [tab, reviewsFetched, user]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = bookings.filter((b) => {
      const d = new Date(b.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      thisMonth,
    };
  }, [bookings]);

  const filtered = bookings.filter((b) => {
    if (statusFilter && b.status !== statusFilter) return false;
    if (search) {
      const term = search.toLowerCase();
      return (
        b.service?.toLowerCase().includes(term) ||
        b.customer?.name?.toLowerCase().includes(term) ||
        b.location?.toLowerCase().includes(term) ||
        b.bookingId?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const act = async (id, status) => {
    setBusyId(id);
    try {
      await updateBookingStatus(id, status);
      toast.success(
        status === 'accepted' ? 'Booking accepted' : status === 'rejected' ? 'Booking rejected' : `Marked as ${status}`
      );
      fetchBookings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        ...profile,
        experience: profile.experience ? Number(profile.experience) : undefined,
        price: profile.price ? Number(profile.price) : undefined,
      };
      const updated = await updateProviderProfile(payload);
      setUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user?.isVerified) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <div className="rounded-2xl bg-white p-10 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-marigold/15 text-2xl">
            ⏳
          </div>
          <h1 className="mt-4 text-xl font-bold text-brand-ink">Your profile is under review</h1>
          <p className="mt-2 text-sm text-brand-ink/55">
            An admin will verify your details shortly. Once approved, you'll start receiving bookings here.
          </p>
        </div>
      </div>
    );
  }

  const STAT_CARDS = [
    { label: 'Total bookings', value: stats.total, Icon: CalendarCheck, color: '#2B2F79' },
    { label: 'Pending requests', value: stats.pending, Icon: Clock, color: '#FFB020' },
    { label: 'Completed jobs', value: stats.completed, Icon: CalendarCheck, color: '#0F9B8E' },
    { label: 'This month', value: stats.thisMonth, Icon: CalendarCheck, color: '#F0553F' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Provider dashboard</h1>
          <p className="mt-1 text-sm text-brand-ink/50">Accept, work, deliver.</p>
        </div>
        <span className="rounded-full bg-brand-teal/15 px-3.5 py-1.5 text-xs font-semibold text-brand-teal">
          Verified provider
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_CARDS.map((s) => (
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

      <div className="mt-6 flex w-fit gap-2 rounded-full bg-white p-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.id ? 'bg-brand-ink text-white' : 'text-brand-ink/50 hover:text-brand-ink'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-55 flex-1">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/35" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer, service, location..."
                className="w-full rounded-full border border-brand-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:border-brand-marigold focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
              />
            </div>
            <FilterDropdown label="Status" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} />
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {loadingBookings ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={180} borderRadius={20} />)
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-16 text-center">
                <p className="font-medium text-brand-ink">No bookings here yet</p>
              </div>
            ) : (
              filtered.map((b) => {
                const action = NEXT_ACTION[b.status];
                return (
                  <BookingCard key={b._id} booking={b} counterpartLabel="Customer" counterpartName={b.customer?.name}>
                    {b.status === 'pending' && (
                      <>
                        <button
                          disabled={busyId === b._id}
                          onClick={() => act(b._id, 'accepted')}
                          className="rounded-full bg-brand-teal px-4 py-2 text-xs font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          disabled={busyId === b._id}
                          onClick={() => act(b._id, 'rejected')}
                          className="rounded-full bg-brand-coral/10 px-4 py-2 text-xs font-semibold text-brand-coral transition hover:bg-brand-coral/20 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {action && (
                      <button
                        disabled={busyId === b._id}
                        onClick={() => act(b._id, action.next)}
                        className="rounded-full bg-brand-marigold px-4 py-2 text-xs font-semibold text-brand-ink transition hover:brightness-105 disabled:opacity-50"
                      >
                        {action.label}
                      </button>
                    )}
                  </BookingCard>
                );
              })
            )}
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
            <StarRating value={user?.rating || 0} size={20} />
            <span className="text-sm text-brand-ink/50">({user?.reviewCount || 0} reviews)</span>
          </div>
          <div className="flex flex-col gap-3">
            {loadingReviews ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={90} borderRadius={16} />)
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-16 text-center text-sm text-brand-ink/50">
                No reviews yet
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-brand-ink">{r.customer?.name || 'Customer'}</p>
                    <StarRating value={r.rating} showValue={false} size={14} />
                  </div>
                  {r.comment && <p className="mt-1.5 text-sm text-brand-ink/60">{r.comment}</p>}
                  <p className="mt-2 text-xs text-brand-ink/35">
                    {new Date(r.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="mt-6 grid grid-cols-1 gap-3.5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Service category</span>
            <input
              value={profile.serviceCategory}
              onChange={(e) => setProfile({ ...profile, serviceCategory: e.target.value })}
              className="input-field"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Location</span>
            <input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="input-field"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Experience (yrs)</span>
            <input
              type="number"
              min="0"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              className="input-field"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Starting price (Rs)</span>
            <input
              type="number"
              min="0"
              value={profile.price}
              onChange={(e) => setProfile({ ...profile, price: e.target.value })}
              className="input-field"
            />
          </label>
          <label className="col-span-full flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-ink">Bio</span>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              className="input-field resize-none"
            />
          </label>
          <button
            type="submit"
            disabled={savingProfile}
            className="col-span-full rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50"
          >
            {savingProfile ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      )}
    </div>
  );
}