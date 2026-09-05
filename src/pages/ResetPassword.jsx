import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, Loader2, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../api/auth';
import { validatePassword } from '../utils/validators';

export default function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            password: validatePassword(password),
            confirmPassword: password !== confirmPassword ? 'Passwords do not match' : '',
        };
        setErrors(newErrors);
        if (newErrors.password || newErrors.confirmPassword) return;

        setSubmitting(true);
        try {
            await resetPassword(token, password);
            setDone(true);
            toast.success('Password reset! You can log in now.');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col items-center justify-center px-5 py-10">
            <div className="w-full rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(23,25,51,0.08)]">
                {done ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal">
                            <CheckCircle2 size={28} />
                        </span>
                        <h1 className="text-xl font-bold text-brand-ink">Password reset</h1>
                        <p className="text-sm text-brand-ink/55">
                            Your password has been updated. You can now log in with your new password.
                        </p>
                        <Link
                            to="/login"
                            className="mt-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo"
                        >
                            Go to login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-center">
                            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-marigold/15 text-[#a35e00]">
                                <KeyRound size={22} />
                            </span>
                            <h1 className="mt-3 text-xl font-bold text-brand-ink">Set a new password</h1>
                            <p className="mt-1 text-sm text-brand-ink/55">Choose a new password for your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold tracking-wide text-brand-ink/70">NEW PASSWORD</label>
                                <div className="relative flex items-center">
                                    <Lock size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) setErrors({ ...errors, password: '' });
                                        }}
                                        className={`w-full rounded-xl border bg-brand-paper/50 py-2.5 pl-10 pr-11 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.password
                                            ? 'border-brand-coral focus:ring-brand-coral/20'
                                            : 'border-brand-ink/10 focus:border-brand-marigold focus:ring-brand-marigold/20'
                                            }`}
                                        placeholder="At least 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 text-brand-ink/40 transition hover:text-brand-ink cursor-pointer"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="flex items-center gap-1 text-xs text-brand-coral">
                                        <AlertCircle size={12} /> {errors.password}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold tracking-wide text-brand-ink/70">CONFIRM PASSWORD</label>
                                <div className="relative flex items-center">
                                    <Lock size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                        }}
                                        className={`w-full rounded-xl border bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.confirmPassword
                                            ? 'border-brand-coral focus:ring-brand-coral/20'
                                            : 'border-brand-ink/10 focus:border-brand-marigold focus:ring-brand-marigold/20'
                                            }`}
                                        placeholder="Re-enter your new password"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <span className="flex items-center gap-1 text-xs text-brand-coral">
                                        <AlertCircle size={12} /> {errors.confirmPassword}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-1 flex items-center justify-center gap-2 rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Resetting…
                                    </>
                                ) : (
                                    'Reset password'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}