import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Phone,
  Wrench,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Users,
  Loader2,
  Rocket,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORY_SUGGESTIONS = [
  'Electrical',
  'Plumbing',
  'Cleaning',
  'Painting',
  'Carpentry',
  'Tutoring',
  'Appliance Repair',
  'Gardening',
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    serviceCategory: '',
    experience: '',
    price: '',
    location: '',
    bio: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, role };
      if (role === 'user') {
        delete payload.serviceCategory;
        delete payload.experience;
        delete payload.price;
        delete payload.location;
        delete payload.bio;
      } else {
        payload.experience = payload.experience ? Number(payload.experience) : undefined;
        payload.price = payload.price ? Number(payload.price) : undefined;
      }

      const data = await register(payload);
      toast.success(
        role === 'provider'
          ? 'Profile registered! An admin will verify your details within 24 hours.'
          : `Welcome to HireEasy, ${data.name.split(' ')[0]}!`
      );
      navigate(role === 'provider' ? '/provider/dashboard' : '/');
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

            <h2 className="mt-10 text-3xl font-bold leading-tight text-white">
              {role === 'user'
                ? 'Join 12,000+ happy homeowners across Pakistan.'
                : 'Turn your skills into steady, daily income.'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {role === 'user'
                ? 'Say goodbye to unreliable handymen. Book verified pros with transparent pricing and live status tracking.'
                : 'Get discovered by customers looking for your exact service. No upfront bidding fees, no hidden cuts.'}
            </p>
          </div>

          {/* Perks list */}
          <div className="relative z-10 mt-8 space-y-3 rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-marigold">
              {role === 'user' ? 'Customer Benefits' : 'Provider Perks'}
            </p>
            {role === 'user' ? (
              <>
                <div className="flex items-center gap-2.5 text-xs text-white/90">
                  <CheckCircle size={15} className="shrink-0 text-brand-teal" />
                  <span>Free browsing and upfront starting rates</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/90">
                  <CheckCircle size={15} className="shrink-0 text-brand-teal" />
                  <span>Real ratings from real completed bookings</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/90">
                  <CheckCircle size={15} className="shrink-0 text-brand-teal" />
                  <span>One-click booking tracker from requested to done</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 text-xs text-white/90">
                  <CheckCircle size={15} className="shrink-0 text-brand-teal" />
                  <span>Direct customer bookings in your local area</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/90">
                  <CheckCircle size={15} className="shrink-0 text-brand-teal" />
                  <span>Official verified pro badge after quick review</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/90">
                  <CheckCircle size={15} className="shrink-0 text-brand-teal" />
                  <span>Manage quotes, status and timings from one dashboard</span>
                </div>
              </>
            )}
          </div>

          <div className="relative z-10 mt-auto flex items-center gap-2 pt-8 text-xs text-white/60">
            <ShieldCheck size={16} className="text-brand-teal" />
            <span>Fast verification • Strict privacy protection</span>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                Create an account
                <Rocket size={22} className="text-brand-marigold" strokeWidth={2.2} />
              </h1>
              <p className="mt-1 text-sm text-brand-ink/55">
                Select your account type to get started.
              </p>
            </div>

            {/* Role Switcher Cards */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition ${role === 'user'
                  ? 'border-brand-indigo bg-brand-indigo/5 ring-2 ring-brand-indigo/20'
                  : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                  }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${role === 'user' ? 'bg-brand-indigo text-white' : 'bg-brand-paper text-brand-ink/60'
                    }`}
                >
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">I need a service</p>
                  <p className="text-[11px] text-brand-ink/50">Book local verified pros</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition ${role === 'provider'
                  ? 'border-brand-indigo bg-brand-indigo/5 ring-2 ring-brand-indigo/20'
                  : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                  }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${role === 'provider'
                    ? 'bg-brand-indigo text-white'
                    : 'bg-brand-paper text-brand-ink/60'
                    }`}
                >
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">I am a provider</p>
                  <p className="text-[11px] text-brand-ink/50">Grow your business</p>
                </div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wide text-brand-ink/70">
                    FULL NAME
                  </label>
                  <div className="relative flex items-center">
                    <User size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                    <input
                      required
                      value={form.name}
                      onChange={update('name')}
                      className="w-full rounded-xl border border-brand-ink/10 bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:border-brand-marigold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                      placeholder="Ali Raza"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wide text-brand-ink/70">
                    PHONE NUMBER
                  </label>
                  <div className="relative flex items-center">
                    <Phone size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                    <input
                      value={form.phone}
                      onChange={update('phone')}
                      className="w-full rounded-xl border border-brand-ink/10 bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:border-brand-marigold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                      placeholder="0300-1234567"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-brand-ink/70">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <Mail size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update('email')}
                    className="w-full rounded-xl border border-brand-ink/10 bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:border-brand-marigold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-brand-ink/70">
                  PASSWORD
                </label>
                <div className="relative flex items-center">
                  <Lock size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={update('password')}
                    className="w-full rounded-xl border border-brand-ink/10 bg-brand-paper/50 py-2.5 pl-10 pr-11 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:border-brand-marigold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-brand-ink/40 transition hover:text-brand-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Provider Extra Fields */}
              {role === 'provider' && (
                <div className="mt-1 space-y-4 rounded-2xl border border-brand-marigold/30 bg-brand-marigold/5 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a35e00]">
                    <Wrench size={15} />
                    <span>Provider Profile Details</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-brand-ink/70">
                        SERVICE CATEGORY
                      </label>
                      <input
                        required
                        list="category-suggestions"
                        value={form.serviceCategory}
                        onChange={update('serviceCategory')}
                        className="input-field"
                        placeholder="e.g. Electrical"
                      />
                      <datalist id="category-suggestions">
                        {CATEGORY_SUGGESTIONS.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-brand-ink/70">
                        LOCATION / AREA
                      </label>
                      <div className="relative flex items-center">
                        <MapPin size={15} className="pointer-events-none absolute left-3 text-brand-ink/35" />
                        <input
                          value={form.location}
                          onChange={update('location')}
                          className="w-full rounded-xl border border-brand-ink/10 bg-white py-2.5 pl-8 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-marigold"
                          placeholder="e.g. Gulshan, Karachi"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-brand-ink/70">
                        EXPERIENCE (YRS)
                      </label>
                      <div className="relative flex items-center">
                        <Clock size={15} className="pointer-events-none absolute left-3 text-brand-ink/35" />
                        <input
                          type="number"
                          min="0"
                          value={form.experience}
                          onChange={update('experience')}
                          className="w-full rounded-xl border border-brand-ink/10 bg-white py-2.5 pl-8 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-marigold"
                          placeholder="3"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-brand-ink/70">
                        STARTING PRICE (RS)
                      </label>
                      <div className="relative flex items-center">
                        <DollarSign size={15} className="pointer-events-none absolute left-3 text-brand-ink/35" />
                        <input
                          type="number"
                          min="0"
                          value={form.price}
                          onChange={update('price')}
                          className="w-full rounded-xl border border-brand-ink/10 bg-white py-2.5 pl-8 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-marigold"
                          placeholder="1500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-brand-ink/70">
                      SHORT BIO
                    </label>
                    <textarea
                      rows={2}
                      value={form.bio}
                      onChange={update('bio')}
                      className="w-full resize-none rounded-xl border border-brand-ink/10 bg-white p-3 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-marigold"
                      placeholder="Tell customers about your skills..."
                    />
                  </div>

                  <p className="text-[11px] leading-relaxed text-[#a35e00]/90">
                    ℹ️ Provider accounts are activated after a quick manual admin review to maintain high community trust.
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-ink py-3 text-sm font-semibold text-white shadow-lg shadow-brand-ink/10 transition hover:bg-brand-indigo hover:shadow-brand-indigo/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Creating your account…</span>
                  </>
                ) : (
                  <>
                    <span>{role === 'provider' ? 'Register as Provider' : 'Create Customer Account'}</span>
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-brand-ink/8 pt-5 text-center">
              <p className="text-sm text-brand-ink/60">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-indigo hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}