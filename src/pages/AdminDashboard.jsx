import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { getProvidersForReview, verifyProvider, getAllBookings, createAdmin } from '../api/admin';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import FilterDropdown from '../components/FilterDropdown';
import StarRating from '../components/StarRating';

const TABS = [
  { id: 'providers', label: 'Providers' },
  { id: 'bookings', label: 'Bookings' },
];

const BOOKING_STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [tab, setTab] = useState('providers');

  const [providerStatus, setProviderStatus] = useState('pending');
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [bookingStatus, setBookingStatus] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const fetchProviders = useCallback(() => {
    setLoadingProviders(true);
    getProvidersForReview(providerStatus)
      .then(setProviders)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoadingProviders(false));
  }, [providerStatus]);

  const fetchBookings = useCallback(() => {
    setLoadingBookings(true);
    getAllBookings(bookingStatus)
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoadingBookings(false));
  }, [bookingStatus]);

  useEffect(() => {
    if (tab === 'providers') fetchProviders();
  }, [tab, fetchProviders]);

  useEffect(() => {
    if (tab === 'bookings') fetchBookings();
  }, [tab, fetchBookings]);

  const decide = async (id, approve) => {
    setBusyId(id);
    try {
      await verifyProvider(id, approve);
      toast.success(approve ? 'Provider approved' : 'Provider rejected');
      fetchProviders();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const submitAdmin = async (e) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      await createAdmin(adminForm);
      toast.success('Admin account created');
      setAdminForm({ name: '', email: '', password: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-2xl font-bold text-brand-ink">{isSuperAdmin ? 'Super Admin' : 'Admin'} dashboard</h1>

      <div className="mt-5 flex gap-2 rounded-full bg-white p-1 shadow-sm w-fit">
        {[...TABS, ...(isSuperAdmin ? [{ id: 'admins', label: 'Admins' }] : [])].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? 'bg-brand-ink text-white' : 'text-brand-ink/50 hover:text-brand-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'providers' && (
        <div className="mt-6">
          <FilterDropdown
            label="Status"
            value={providerStatus}
            options={[
              { id: 'pending', label: 'Pending' },
              { id: 'verified', label: 'Verified' },
            ]}
            onChange={(v) => setProviderStatus(v || 'pending')}
          />

          <div className="mt-4 flex flex-col gap-3">
            {loadingProviders ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={90} borderRadius={16} />)
            ) : providers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-14 text-center text-sm text-brand-ink/50">
                Nothing here right now
              </div>
            ) : (
              providers.map((p) => (
                <div key={p._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
                  <div>
                    <p className="font-semibold text-brand-ink">{p.name}</p>
                    <p className="text-sm text-brand-ink/55">
                      {p.serviceCategory} · {p.location} · {p.experience || 0} yrs
                    </p>
                    <StarRating value={p.rating || 0} size={13} />
                  </div>
                  {providerStatus === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        disabled={busyId === p._id}
                        onClick={() => decide(p._id, true)}
                        className="rounded-full bg-brand-teal px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={busyId === p._id}
                        onClick={() => decide(p._id, false)}
                        className="rounded-full bg-brand-coral/10 px-4 py-2 text-xs font-semibold text-brand-coral disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="mt-6">
          <FilterDropdown label="Status" value={bookingStatus} options={BOOKING_STATUS_OPTIONS} onChange={setBookingStatus} />
          <div className="mt-4 flex flex-col gap-4">
            {loadingBookings ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={160} borderRadius={20} />)
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-14 text-center text-sm text-brand-ink/50">
                No bookings match
              </div>
            ) : (
              bookings.map((b) => (
                <BookingCard key={b._id} booking={b} counterpartLabel="Customer → Provider" counterpartName={`${b.customer?.name} → ${b.provider?.name}`} />
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'admins' && isSuperAdmin && (
        <form onSubmit={submitAdmin} className="mt-6 flex max-w-sm flex-col gap-3.5 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-brand-ink">Create a new Admin</h2>
          <input
            required
            placeholder="Full name"
            value={adminForm.name}
            onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
            className="input-field"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={adminForm.email}
            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
            className="input-field"
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder="Temporary password"
            value={adminForm.password}
            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
            className="input-field"
          />
          <button
            type="submit"
            disabled={creatingAdmin}
            className="rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50"
          >
            {creatingAdmin ? 'Creating…' : 'Create admin'}
          </button>
        </form>
      )}
    </div>
  );
}
