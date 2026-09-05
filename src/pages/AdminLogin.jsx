import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, isFormValid } from '../utils/validators';

export default function AdminLogin() {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Already logged in as admin/superadmin? Skip straight to the panel.
    useEffect(() => {
        if (user && ['admin', 'superadmin'].includes(user.role)) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const validateField = (field, value) => {
        if (field === 'email') return validateEmail(value);
        if (field === 'password') return validatePassword(value);
        return '';
    };

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setForm({ ...form, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const handleBlur = (field) => () => {
        setErrors({ ...errors, [field]: validateField(field, form[field]) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            email: validateEmail(form.email),
            password: validatePassword(form.password),
        };
        setErrors(newErrors);
        if (!isFormValid(newErrors)) return;

        setSubmitting(true);
        try {
            const data = await login(form.email.trim(), form.password);

            if (!['admin', 'superadmin'].includes(data.role)) {
                // Wrong kind of account logged in through this door — undo it quietly.
                logout({ silent: true });
                toast.error('This account does not have admin access');
                return;
            }

            toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-ink px-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-ink">
                        <ShieldCheck size={28} className="text-white" strokeWidth={2} />
                    </span>
                    <h1 className="mt-4 text-2xl font-bold text-brand-ink">Admin Panel</h1>
                    <p className="mt-1 text-sm text-brand-ink/50">Sign in with your admin account</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-brand-ink">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={handleChange('email')}
                                onBlur={handleBlur('email')}
                                className={`w-full rounded-2xl border bg-brand-paper py-3 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.email
                                    ? 'border-brand-coral focus:ring-brand-coral/20'
                                    : 'border-transparent focus:ring-brand-ink/15'
                                    }`}
                                placeholder="admin@example.com"
                            />
                        </div>
                        {errors.email && <span className="text-xs text-brand-coral">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-brand-ink">Password</label>
                        <div className="relative flex items-center">
                            <Lock size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange('password')}
                                onBlur={handleBlur('password')}
                                className={`w-full rounded-2xl border bg-brand-paper py-3 pl-10 pr-11 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.password
                                    ? 'border-brand-coral focus:ring-brand-coral/20'
                                    : 'border-transparent focus:ring-brand-ink/15'
                                    }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-3.5 text-brand-ink/40 transition hover:text-brand-ink"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        {errors.password && <span className="text-xs text-brand-coral">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand-ink py-3.5 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={17} className="animate-spin" /> Signing in…
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}