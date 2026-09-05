import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Search, Pencil, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import { getAdminCustomers, updateAdminCustomer, toggleCustomerStatus, deleteAdminCustomer } from '../../api/admin';
import FilterDropdown from '../../components/FilterDropdown';
import Modal from '../../components/Modal';

const ACTIVE_OPTIONS = [
    { id: 'true', label: 'Active' },
    { id: 'false', label: 'Inactive' },
];

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isActive, setIsActive] = useState('');
    const [busyId, setBusyId] = useState(null);

    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', phone: '' });
    const [savingEdit, setSavingEdit] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchCustomers = useCallback(() => {
        setLoading(true);
        getAdminCustomers({ search: search || undefined, isActive: isActive || undefined })
            .then(setCustomers)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, [search, isActive]);

    useEffect(() => {
        const t = setTimeout(fetchCustomers, 300);
        return () => clearTimeout(t);
    }, [fetchCustomers]);

    const toggleActive = async (customer) => {
        setBusyId(customer._id);
        try {
            await toggleCustomerStatus(customer._id, !customer.isActive);
            toast.success(customer.isActive ? 'Customer deactivated' : 'Customer activated');
            fetchCustomers();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusyId(null);
        }
    };

    const openEdit = (customer) => {
        setEditTarget(customer);
        setEditForm({ name: customer.name || '', phone: customer.phone || '' });
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        setSavingEdit(true);
        try {
            await updateAdminCustomer(editTarget._id, editForm);
            toast.success('Customer updated');
            setEditTarget(null);
            fetchCustomers();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingEdit(false);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteAdminCustomer(deleteTarget._id);
            toast.success('Customer deleted');
            setDeleteTarget(null);
            fetchCustomers();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold text-brand-ink">Customers</h1>
                <p className="mt-1 text-sm text-brand-ink/50">Every customer account on the platform.</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="relative min-w-55 flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/35" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, phone..."
                        className="w-full rounded-full border border-brand-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:border-brand-marigold focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                    />
                </div>
                <FilterDropdown label="Account" value={isActive} options={ACTIVE_OPTIONS} onChange={setIsActive} />
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
                {loading ? (
                    <div className="flex flex-col gap-2 p-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} height={50} borderRadius={12} />
                        ))}
                    </div>
                ) : customers.length === 0 ? (
                    <div className="py-14 text-center text-sm text-brand-ink/50">No customers match these filters</div>
                ) : (
                    <div className="divide-y divide-brand-ink/5">
                        {customers.map((c) => (
                            <div key={c._id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-brand-ink">{c.name}</p>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${c.isActive ? 'bg-brand-teal/15 text-brand-teal' : 'bg-brand-coral/15 text-brand-coral'}`}
                                        >
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-brand-ink/50">
                                        {c.email} {c.phone ? `· ${c.phone}` : ''}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        disabled={busyId === c._id}
                                        onClick={() => toggleActive(c)}
                                        className={`cursor-pointer flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold disabled:opacity-50 ${c.isActive ? 'bg-brand-coral/10 text-brand-coral' : 'bg-brand-teal/10 text-brand-teal'}`}
                                    >
                                        {c.isActive ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                                        {c.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="flex items-center gap-1 rounded-full border border-brand-ink/10 px-3.5 py-2 text-xs font-semibold text-brand-ink hover:border-brand-ink/25 cursor-pointer"
                                    >
                                        <Pencil size={13} /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(c)}
                                        className="flex items-center gap-1 rounded-full bg-brand-coral/10 px-3.5 py-2 text-xs font-semibold text-brand-coral hover:bg-brand-coral/20"
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit customer">
                <form onSubmit={saveEdit} className="flex flex-col gap-3.5">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Name</span>
                        <input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input-field" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Phone</span>
                        <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="input-field" />
                    </label>
                    <button type="submit" disabled={savingEdit} className="rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50">
                        {savingEdit ? 'Saving…' : 'Save changes'}
                    </button>
                </form>
            </Modal>

            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete customer">
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