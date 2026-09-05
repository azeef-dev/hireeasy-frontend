import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Search, Pencil, Trash2, ShieldCheck, ShieldOff, Check, X as XIcon } from 'lucide-react';
import {
    getAdminProviders,
    verifyProvider,
    updateAdminProvider,
    toggleProviderStatus,
    deleteAdminProvider,
} from '../../api/admin';
import FilterDropdown from '../../components/FilterDropdown';
import Modal from '../../components/Modal';
import StarRating from '../../components/StarRating';

const STATUS_OPTIONS = [
    { id: 'pending', label: 'Pending' },
    { id: 'verified', label: 'Verified' },
];

const ACTIVE_OPTIONS = [
    { id: 'true', label: 'Active' },
    { id: 'false', label: 'Inactive' },
];

export default function AdminProviders() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isActive, setIsActive] = useState('');
    const [busyId, setBusyId] = useState(null);

    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [savingEdit, setSavingEdit] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProviders = useCallback(() => {
        setLoading(true);
        getAdminProviders({
            status: status || 'all',
            isActive: isActive || undefined,
            search: search || undefined,
        })
            .then(setProviders)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, [status, isActive, search]);

    useEffect(() => {
        const t = setTimeout(fetchProviders, 300);
        return () => clearTimeout(t);
    }, [fetchProviders]);

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

    const toggleActive = async (provider) => {
        setBusyId(provider._id);
        try {
            await toggleProviderStatus(provider._id, !provider.isActive);
            toast.success(provider.isActive ? 'Provider deactivated' : 'Provider activated');
            fetchProviders();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusyId(null);
        }
    };

    const openEdit = (provider) => {
        setEditTarget(provider);
        setEditForm({
            name: provider.name || '',
            phone: provider.phone || '',
            serviceCategory: provider.serviceCategory || '',
            experience: provider.experience ?? '',
            price: provider.price ?? '',
            location: provider.location || '',
            bio: provider.bio || '',
        });
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        setSavingEdit(true);
        try {
            const payload = {
                ...editForm,
                experience: editForm.experience === '' ? undefined : Number(editForm.experience),
                price: editForm.price === '' ? undefined : Number(editForm.price),
            };
            await updateAdminProvider(editTarget._id, payload);
            toast.success('Provider updated');
            setEditTarget(null);
            fetchProviders();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingEdit(false);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteAdminProvider(deleteTarget._id);
            toast.success('Provider deleted');
            setDeleteTarget(null);
            fetchProviders();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-ink">Providers</h1>
                    <p className="mt-1 text-sm text-brand-ink/50">Review, verify, edit and manage every provider.</p>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="relative min-w-55 flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/35" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, category, location..."
                        className="w-full rounded-full border border-brand-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:border-brand-marigold focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                    />
                </div>
                <FilterDropdown label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
                <FilterDropdown label="Account" value={isActive} options={ACTIVE_OPTIONS} onChange={setIsActive} />
            </div>

            <div className="mt-5 flex flex-col gap-3">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={100} borderRadius={16} />)
                ) : providers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-14 text-center text-sm text-brand-ink/50">
                        No providers match these filters
                    </div>
                ) : (
                    providers.map((p) => (
                        <div key={p._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold text-brand-ink">{p.name}</p>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${p.isVerified ? 'bg-brand-teal/15 text-brand-teal' : 'bg-brand-marigold/15 text-[#a35e00]'}`}
                                    >
                                        {p.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${p.isActive ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-brand-coral/15 text-brand-coral'}`}
                                    >
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-brand-ink/55">
                                    {p.serviceCategory} · {p.location || 'No location'} · {p.experience || 0} yrs
                                </p>
                                <p className="text-xs text-brand-ink/45">
                                    {p.email} {p.phone ? `· ${p.phone}` : ''}
                                </p>
                                <div className="mt-1.5">
                                    <StarRating value={p.rating || 0} size={13} />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {!p.isVerified && (
                                    <>
                                        <button
                                            disabled={busyId === p._id}
                                            onClick={() => decide(p._id, true)}
                                            className="flex items-center gap-1 rounded-full bg-brand-teal px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer"
                                        >
                                            <Check size={13} /> Approve
                                        </button>
                                        <button
                                            disabled={busyId === p._id}
                                            onClick={() => decide(p._id, false)}
                                            className="flex items-center gap-1 rounded-full bg-brand-coral/10 px-3.5 py-2 text-xs font-semibold text-brand-coral disabled:opacity-50"
                                        >
                                            <XIcon size={13} /> Reject
                                        </button>
                                    </>
                                )}
                                {p.isVerified && (
                                    <button
                                        disabled={busyId === p._id}
                                        onClick={() => toggleActive(p)}
                                        className={`cursor-pointer flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold disabled:opacity-50 ${p.isActive ? 'bg-brand-coral/10 text-brand-coral' : 'bg-brand-teal/10 text-brand-teal'}`}
                                    >
                                        {p.isActive ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                                        {p.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                )}
                                <button
                                    onClick={() => openEdit(p)}
                                    className="flex items-center gap-1 rounded-full border border-brand-ink/10 px-3.5 py-2 text-xs font-semibold text-brand-ink hover:border-brand-ink/25 cursor-pointer"
                                >
                                    <Pencil size={13} /> Edit
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(p)}
                                    className="flex items-center gap-1 rounded-full bg-brand-coral/10 px-3.5 py-2 text-xs font-semibold text-brand-coral hover:bg-brand-coral/20 cursor-pointer"
                                >
                                    <Trash2 size={13} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit provider">
                <form onSubmit={saveEdit} className="flex flex-col gap-3.5">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Name</span>
                        <input required value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input-field" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Phone</span>
                        <input value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="input-field" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Service category</span>
                        <input required value={editForm.serviceCategory || ''} onChange={(e) => setEditForm({ ...editForm, serviceCategory: e.target.value })} className="input-field" />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-brand-ink">Experience (yrs)</span>
                            <input type="number" min="0" value={editForm.experience ?? ''} onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })} className="input-field" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-brand-ink">Starting price (Rs)</span>
                            <input type="number" min="0" value={editForm.price ?? ''} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="input-field" />
                        </label>
                    </div>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Location</span>
                        <input required value={editForm.location || ''} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="input-field" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Bio</span>
                        <textarea value={editForm.bio || ''} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3} className="input-field resize-none" />
                    </label>
                    <button type="submit" disabled={savingEdit} className="rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50">
                        {savingEdit ? 'Saving…' : 'Save changes'}
                    </button>
                </form>
            </Modal>

            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete provider">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-brand-ink/65">
                        Are you sure you want to permanently delete <span className="font-semibold text-brand-ink">{deleteTarget?.name}</span>? This cannot be undone.
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