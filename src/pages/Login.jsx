import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  Loader2,
  CheckCircle2,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DASHBOARD_PATH = {
  user: '/dashboard',
  provider: '/provider/dashboard',
  admin: '/admin/dashboard',
  superadmin: '/admin/dashboard',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
      navigate(DASHBOARD_PATH[data.role] || '/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_rgba(23,25,51,0.08)] lg:grid-cols-2">
        {/* ── Left Showcase Panel ── */}
        <div className="relative hidden flex-col overflow-hidden bg-brand-indigo p-9 text-white lg:flex">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-marigold/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-teal/20 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base font-bold text-brand-indigo shadow-md">
                H
              </span>
              <span className="text-xl font-bold tracking-tight text-white">HireEasy</span>
            </Link>

            <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
              <Sparkles size={14} className="text-brand-marigold" />
              <span>Verified Home Services</span>
            </div>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-white">
              Reliable help is just a login away.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Check in on your current bookings, leave reviews for recent jobs, or take on new service requests.
            </p>
          </div>

          {/* Mini Testimonial Quote */}
          <div className="relative z-10 mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-center gap-1 text-brand-marigold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#FFB020" />
              ))}
            </div>
            <p className="mt-2 text-xs italic text-white/90">
              &quot;Finding a verified plumber within 10 minutes saved my kitchen from total flooding. 10/10 recommend HireEasy!&quot;
            </p>
            <p className="mt-2 text-xs font-semibold text-white/80">— Ayesha K., Karachi</p>
          </div>

          <div className="relative z-10 mt-auto flex items-center gap-6 pt-8 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-brand-teal" /> 100% Vetted Pros
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-brand-teal" /> Live Status Updates
            </span>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-14">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8">
              <span className="inline-block rounded-full bg-brand-marigold/15 px-3 py-1 text-xs font-semibold text-[#a35e00] lg:hidden">
                HireEasy
              </span>
              <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                Welcome back!
                <LogIn size={22} className="text-brand-marigold" strokeWidth={2.2} />
              </h1>
              <p className="mt-1.5 text-sm text-brand-ink/55">
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-brand-ink/70">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <Mail size={18} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-brand-ink/10 bg-brand-paper/50 py-2.5 pl-11 pr-4 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:border-brand-marigold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold tracking-wide text-brand-ink/70">
                    PASSWORD
                  </label>
                  <span className="text-xs text-brand-indigo hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Lock size={18} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-brand-ink/10 bg-brand-paper/50 py-2.5 pl-11 pr-11 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:border-brand-marigold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-brand-ink/40 transition hover:text-brand-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-ink py-3 text-sm font-semibold text-white shadow-lg shadow-brand-ink/10 transition hover:bg-brand-indigo hover:shadow-brand-indigo/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Log in to your account</span>
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <div className="mt-8 border-t border-brand-ink/8 pt-6 text-center">
              <p className="text-sm text-brand-ink/60">
                Don&apos;t have an account yet?{' '}
                <Link to="/register" className="font-semibold text-brand-indigo hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}