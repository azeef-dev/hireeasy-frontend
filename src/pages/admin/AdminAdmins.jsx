import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Plus, Pencil, Trash2, ShieldCheck, ShieldOff, KeyRound } from 'lucide-react';
import {
    getAdmins,
    createAdmin,
    updateAdmin,
    toggleAdminStatus,
    resetAdminPassword,
    deleteAdmin,
} from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

export default function AdminAdmins() {
    const { user: currentUser } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [creating, setCreating] = useState(false);

    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
    const [savingEdit, setSavingEdit] = useState(false);

    const [passwordTarget, setPasswordTarget] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchAdmins = useCallback(() => {
        setLoading(true);
        getAdmins()
            .then(setAdmins)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(fetchAdmins, [fetchAdmins]);

    const submitCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await createAdmin(createForm);
            toast.success('Admin account created');
            setCreateForm({ name: '', email: '', password: '', phone: '' });
            setCreateOpen(false);
            fetchAdmins();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setCreating(false);
        }
    };

    const openEdit = (admin) => {
        setEditTarget(admin);
        setEditForm({ name: admin.name || '', email: admin.email || '', phone: admin.phone || '' });
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        setSavingEdit(true);
        try {
            await updateAdmin(editTarget._id, editForm);
            toast.success('Admin updated');
            setEditTarget(null);
            fetchAdmins();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingEdit(false);
        }
    };

    const toggleActive = async (admin) => {
        setBusyId(admin._id);
        try {
            await toggleAdminStatus(admin._id, !admin.isActive);
            toast.success(admin.isActive ? 'Admin deactivated' : 'Admin activated');
            fetchAdmins();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusyId(null);
        }
    };

    const submitPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setSavingPassword(true);
        try {
            await resetAdminPassword(passwordTarget._id, newPassword);
            toast.success('Password updated');
            setPasswordTarget(null);
            setNewPassword('');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingPassword(false);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await deleteAdmin(deleteTarget._id);
            toast.success('Admin deleted');
            setDeleteTarget(null);
            fetchAdmins();
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
                    <h1 className="text-2xl font-bold text-brand-ink">Admins</h1>
                    <p className="mt-1 text-sm text-brand-ink/50">Manage every admin account on HireEasy.</p>
                </div>
                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-1.5 rounded-full bg-brand-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-indigo"
                >
                    <Plus size={15} /> New admin
                </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
                {loading ? (
                    <div className="flex flex-col gap-2 p-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} height={50} borderRadius={12} />
                        ))}
                    </div>
                ) : admins.length === 0 ? (
                    <div className="py-14 text-center text-sm text-brand-ink/50">No admin accounts yet</div>
                ) : (
                    <div className="divide-y divide-brand-ink/5">
                        {admins.map((a) => {
                            const isSelf = a._id === currentUser?._id;
                            return (
                                <div key={a._id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-brand-ink">{a.name}</p>
                                            {isSelf && (
                                                <span className="rounded-full bg-brand-indigo/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-indigo">
                                                    You
                                                </span>
                                            )}
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${a.isActive ? 'bg-brand-teal/15 text-brand-teal' : 'bg-brand-coral/15 text-brand-coral'}`}
                                            >
                                                {a.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-brand-ink/50">
                                            {a.email} {a.phone ? `· ${a.phone}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => setPasswordTarget(a)}
                                            className="flex items-center gap-1 rounded-full border border-brand-ink/10 px-3.5 py-2 text-xs font-semibold text-brand-ink hover:border-brand-ink/25"
                                        >
                                            <KeyRound size={13} /> Reset password
                                        </button>
                                        <button
                                            onClick={() => openEdit(a)}
                                            className="flex items-center gap-1 rounded-full border border-brand-ink/10 px-3.5 py-2 text-xs font-semibold text-brand-ink hover:border-brand-ink/25"
                                        >
                                            <Pencil size={13} /> Edit
                                        </button>
                                        <button
                                            disabled={isSelf || busyId === a._id}
                                            onClick={() => toggleActive(a)}
                                            className={`cursor-pointer flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${a.isActive ? 'bg-brand-coral/10 text-brand-coral' : 'bg-brand-teal/10 text-brand-teal'}`}
                                        >
                                            {a.isActive ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                                            {a.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            disabled={isSelf}
                                            onClick={() => setDeleteTarget(a)}
                                            className="flex items-center gap-1 rounded-full bg-brand-coral/10 px-3.5 py-2 text-xs font-semibold text-brand-coral hover:bg-brand-coral/20 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a new admin">
                <form onSubmit={submitCreate} className="flex flex-col gap-3.5">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Full name</span>
                        <input required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className="input-field" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Email</span>
                        <input required type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="input-field" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Phone</span>
                        <input value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} className="input-field" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Temporary password</span>
                        <input required type="password" minLength={6} value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="input-field" />
                    </label>
                    <button type="submit" disabled={creating} className="rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50">
                        {creating ? 'Creating…' : 'Create admin'}
                    </button>
                </form>
            </Modal>

            <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit admin">
                <form onSubmit={saveEdit} className="flex flex-col gap-3.5">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Full name</span>
                        <input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input-field" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">Email</span>
                        <input required type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="input-field" />
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

            <Modal
                open={!!passwordTarget}
                onClose={() => {
                    setPasswordTarget(null);
                    setNewPassword('');
                }}
                title="Reset admin password"
            >
                <form onSubmit={submitPassword} className="flex flex-col gap-3.5">
                    <p className="text-sm text-brand-ink/60">
                        Set a new password for <span className="font-semibold text-brand-ink">{passwordTarget?.name}</span>.
                    </p>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-brand-ink">New password</span>
                        <input required type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" placeholder="At least 6 characters" />
                    </label>
                    <button type="submit" disabled={savingPassword} className="rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50">
                        {savingPassword ? 'Saving…' : 'Update password'}
                    </button>
                </form>
            </Modal>

            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete admin">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-brand-ink/65">
                        Are you sure you want to permanently delete <span className="font-semibold text-brand-ink">{deleteTarget?.name}</span>'s admin account? This cannot be undone.
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