import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { getProviderBookings, updateBookingStatus } from '../api/bookings';
import { updateProviderProfile } from '../api/providers';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import FilterDropdown from '../components/FilterDropdown';

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

export default function ProviderDashboard() {
  const { user, setUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({
    serviceCategory: user?.serviceCategory || '',
    experience: user?.experience || '',
    price: user?.price || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    getProviderBookings()
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(fetchBookings, [fetchBookings]);

  const filtered = statusFilter ? bookings.filter((b) => b.status === statusFilter) : bookings;

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
      setShowProfile(false);
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

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Incoming bookings</h1>
          <p className="mt-1 text-sm text-brand-ink/50">Accept, work, deliver.</p>
        </div>
        <div className="flex gap-2">
          <FilterDropdown label="Status" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} />
          <button
            onClick={() => setShowProfile((s) => !s)}
            className="rounded-full border border-brand-ink/10 bg-white px-4 py-2.5 text-sm font-medium text-brand-ink hover:border-brand-ink/25"
          >
            Edit profile
          </button>
        </div>
      </div>

      {showProfile && (
        <form onSubmit={saveProfile} className="mt-5 grid grid-cols-1 gap-3.5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
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

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
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
  );
}
