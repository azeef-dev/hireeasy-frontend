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
  Info,
  Zap,
  PaintBucket,
  Sparkles,
  Star,
  TrendingUp,
  AlertCircle,
  FileText,
  UserPlus,
  BadgeCheck,
  Banknote,
  Search,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CategorySelect from '../components/CategorySelect';
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePhone,
  validateCategory,
  validateRequiredText,
  validateNumber,
  sanitizePhoneInput,
  sanitizeDigitsInput,
  isFormValid,
} from '../utils/validators';

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

const AVATAR_ICONS = [
  { Icon: Zap, bg: '#FFB020' },
  { Icon: Wrench, bg: '#47BFFF' },
  { Icon: PaintBucket, bg: '#F0553F' },
  { Icon: Sparkles, bg: '#0F9B8E' },
];

const QUICK_STATS = [
  { Icon: Users, value: '500+', label: 'Providers' },
  { Icon: Star, value: '4.8', label: 'Avg. rating' },
  { Icon: TrendingUp, value: '12k+', label: 'Bookings' },
];

const PROVIDER_STEPS = [
  { Icon: UserPlus, title: 'Create your profile', desc: 'Add your category, area and pricing' },
  { Icon: BadgeCheck, title: 'Get verified', desc: 'Admin review, usually within 24 hours' },
  { Icon: Banknote, title: 'Start earning', desc: 'Accept bookings and get paid directly' },
];

const CUSTOMER_STEPS = [
  { Icon: Search, title: 'Find a pro', desc: 'Search or browse by category near you' },
  { Icon: CalendarCheck, title: 'Book instantly', desc: 'Pick a date, time and place — done' },
  { Icon: Star, title: 'Rate the job', desc: 'Leave a review once the work is complete' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const updatePhone = (e) => {
    setForm({ ...form, phone: sanitizePhoneInput(e.target.value) });
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  const updateNumberField = (field) => (e) => {
    setForm({ ...form, [field]: sanitizeDigitsInput(e.target.value) });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const updateCategory = (value) => {
    setForm({ ...form, serviceCategory: value });
    if (errors.serviceCategory) setErrors({ ...errors, serviceCategory: '' });
  };

  const validateFieldByName = (field, value) => {
    switch (field) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'phone':
        return validatePhone(value, false);
      case 'serviceCategory':
        return role === 'provider' ? validateCategory(value) : '';
      case 'location':
        return role === 'provider' ? validateRequiredText(value, 'Location', 2, 80) : '';
      case 'experience':
        return role === 'provider' ? validateNumber(value, 'Experience', { min: 0, max: 60 }) : '';
      case 'price':
        return role === 'provider' ? validateNumber(value, 'Starting price', { min: 0, max: 1000000 }) : '';
      case 'bio':
        if (role === 'provider' && value.trim()) {
          return validateRequiredText(value, 'Bio', 10, 500);
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => () => {
    setErrors((prev) => ({ ...prev, [field]: validateFieldByName(field, form[field]) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsToCheck = ['name', 'email', 'password', 'phone'];
    if (role === 'provider') {
      fieldsToCheck.push('serviceCategory', 'location', 'experience', 'price', 'bio');
    }

    const newErrors = {};
    fieldsToCheck.forEach((field) => {
      newErrors[field] = validateFieldByName(field, form[field]);
    });
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role,
      };
      if (role === 'user') {
        delete payload.serviceCategory;
        delete payload.experience;
        delete payload.price;
        delete payload.location;
        delete payload.bio;
      } else {
        payload.location = payload.location.trim();
        payload.bio = payload.bio.trim();
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

  const errorText = (field) =>
    errors[field] ? (
      <span className="flex items-center gap-1 text-xs text-brand-coral">
        <AlertCircle size={12} /> {errors[field]}
      </span>
    ) : null;

  const steps = role === 'provider' ? PROVIDER_STEPS : CUSTOMER_STEPS;

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

          <div className="relative z-10 flex flex-1 flex-col gap-6">
            <div>
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base font-bold text-brand-indigo shadow-md">
                  H
                </span>
                <span className="text-xl font-bold tracking-tight text-white">HireEasy</span>
              </Link>

              <h2 className="mt-8 text-3xl font-bold leading-tight text-white">
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
            <div className="space-y-3 rounded-2xl bg-white/10 p-5 backdrop-blur-md">
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

            {/* Avatar stack — visual filler */}
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
              <div className="flex -space-x-3">
                {AVATAR_ICONS.map(({ Icon, bg }, i) => (
                  <span
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-indigo"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon size={15} className="text-white" strokeWidth={2} />
                  </span>
                ))}
              </div>
              <p className="text-xs leading-snug text-white/75">
                Electricians, plumbers, painters &amp; cleaners already growing with HireEasy.
              </p>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-3">
              {QUICK_STATS.map((s) => (
                <div key={s.label} className="rounded-xl bg-white/5 px-3 py-3 text-center">
                  <s.Icon size={16} className="mx-auto text-brand-marigold" />
                  <p className="mt-1.5 text-sm font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-white/60">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Category chips */}
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Popular categories on HireEasy
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Get started in 3 steps — fills remaining space, always relevant */}
            <div className="flex-1 rounded-2xl bg-white/5 p-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Get started in 3 steps
              </p>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <step.Icon size={16} className="text-brand-marigold" strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {i + 1}. {step.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck size={16} className="text-brand-teal" />
              <span>Fast verification • Strict privacy protection</span>
            </div>
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

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wide text-brand-ink/70">
                    FULL NAME
                  </label>
                  <div className="relative flex items-center">
                    <User size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                    <input
                      value={form.name}
                      onChange={update('name')}
                      onBlur={handleBlur('name')}
                      className={`w-full rounded-xl border bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.name
                        ? 'border-brand-coral focus:ring-brand-coral/20'
                        : 'border-brand-ink/10 focus:border-brand-marigold focus:ring-brand-marigold/20'
                        }`}
                      placeholder="Ali Raza"
                    />
                  </div>
                  {errorText('name')}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wide text-brand-ink/70">
                    PHONE NUMBER
                  </label>
                  <div className="relative flex items-center">
                    <Phone size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                    <input
                      value={form.phone}
                      onChange={updatePhone}
                      onBlur={handleBlur('phone')}
                      inputMode="tel"
                      className={`w-full rounded-xl border bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.phone
                        ? 'border-brand-coral focus:ring-brand-coral/20'
                        : 'border-brand-ink/10 focus:border-brand-marigold focus:ring-brand-marigold/20'
                        }`}
                      placeholder="0300-1234567"
                    />
                  </div>
                  {errorText('phone')}
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
                    value={form.email}
                    onChange={update('email')}
                    onBlur={handleBlur('email')}
                    className={`w-full rounded-xl border bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.email
                      ? 'border-brand-coral focus:ring-brand-coral/20'
                      : 'border-brand-ink/10 focus:border-brand-marigold focus:ring-brand-marigold/20'
                      }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errorText('email')}
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
                    value={form.password}
                    onChange={update('password')}
                    onBlur={handleBlur('password')}
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
                {errorText('password')}
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
                      <CategorySelect
                        value={form.serviceCategory}
                        onChange={updateCategory}
                        options={CATEGORY_SUGGESTIONS}
                        placeholder="e.g. Electrical"
                        error={errors.serviceCategory}
                      />
                      {errorText('serviceCategory')}
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
                          onBlur={handleBlur('location')}
                          className={`w-full rounded-xl border bg-white py-2.5 pl-8 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 ${errors.location
                            ? 'border-brand-coral focus:ring-brand-coral/20'
                            : 'border-brand-ink/10 focus:ring-brand-marigold'
                            }`}
                          placeholder="e.g. Gulshan, Karachi"
                        />
                      </div>
                      {errorText('location')}
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
                          value={form.experience}
                          onChange={updateNumberField('experience')}
                          onBlur={handleBlur('experience')}
                          inputMode="numeric"
                          className={`w-full rounded-xl border bg-white py-2.5 pl-8 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 ${errors.experience
                            ? 'border-brand-coral focus:ring-brand-coral/20'
                            : 'border-brand-ink/10 focus:ring-brand-marigold'
                            }`}
                          placeholder="3"
                        />
                      </div>
                      {errorText('experience')}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-brand-ink/70">
                        STARTING PRICE (RS)
                      </label>
                      <div className="relative flex items-center">
                        <DollarSign size={15} className="pointer-events-none absolute left-3 text-brand-ink/35" />
                        <input
                          value={form.price}
                          onChange={updateNumberField('price')}
                          onBlur={handleBlur('price')}
                          inputMode="numeric"
                          className={`w-full rounded-xl border bg-white py-2.5 pl-8 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 ${errors.price
                            ? 'border-brand-coral focus:ring-brand-coral/20'
                            : 'border-brand-ink/10 focus:ring-brand-marigold'
                            }`}
                          placeholder="1500"
                        />
                      </div>
                      {errorText('price')}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-brand-ink/70">
                      SHORT BIO
                    </label>
                    <div className="relative">
                      <FileText size={15} className="pointer-events-none absolute left-3 top-3 text-brand-ink/35" />
                      <textarea
                        rows={2}
                        value={form.bio}
                        onChange={update('bio')}
                        onBlur={handleBlur('bio')}
                        className={`w-full resize-none rounded-xl border bg-white py-2.5 pl-8 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:outline-none focus:ring-2 ${errors.bio
                          ? 'border-brand-coral focus:ring-brand-coral/20'
                          : 'border-brand-ink/10 focus:ring-brand-marigold'
                          }`}
                        placeholder="Tell customers about your skills..."
                      />
                    </div>
                    {errorText('bio')}
                  </div>

                  <div className="flex items-start gap-2 text-[11px] leading-relaxed text-[#a35e00]">
                    <Info size={14} className="mt-0.5 shrink-0" strokeWidth={2} />
                    <span>
                      Provider accounts are activated after a quick manual admin review to
                      maintain high community trust.
                    </span>
                  </div>
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