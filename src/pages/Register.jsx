import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CATEGORY_SUGGESTIONS = ['Plumbing', 'Electrical', 'Cleaning', 'Tutoring', 'Appliance Repair', 'Painting'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
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
          ? "Account created — an admin will verify your profile shortly"
          : `Welcome, ${data.name.split(' ')[0]}`
      );
      navigate(role === 'provider' ? '/provider/dashboard' : '/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="text-2xl font-bold text-brand-ink">Create an account</h1>
      <p className="mt-1 text-sm text-brand-ink/55">Book help, or start taking bookings.</p>

      <div className="mt-6 flex rounded-full bg-white p-1 shadow-sm">
        {[
          { key: 'user', label: "I need a service" },
          { key: 'provider', label: 'I provide a service' },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setRole(opt.key)}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
              role === opt.key ? 'bg-brand-ink text-white' : 'text-brand-ink/50 hover:text-brand-ink'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand-ink">Full name</span>
          <input required value={form.name} onChange={update('name')} className="input-field" placeholder="Ali Raza" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand-ink">Email</span>
          <input type="email" required value={form.email} onChange={update('email')} className="input-field" placeholder="you@example.com" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand-ink">Phone</span>
          <input value={form.phone} onChange={update('phone')} className="input-field" placeholder="03xx-xxxxxxx" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand-ink">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update('password')}
            className="input-field"
            placeholder="At least 6 characters"
          />
        </label>

        {role === 'provider' && (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-brand-ink">Service category</span>
              <input
                required
                list="category-suggestions"
                value={form.serviceCategory}
                onChange={update('serviceCategory')}
                className="input-field"
                placeholder="e.g. Plumbing"
              />
              <datalist id="category-suggestions">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-brand-ink">Experience (yrs)</span>
                <input type="number" min="0" value={form.experience} onChange={update('experience')} className="input-field" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-brand-ink">Starting price (Rs)</span>
                <input type="number" min="0" value={form.price} onChange={update('price')} className="input-field" />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-brand-ink">Location / area</span>
              <input value={form.location} onChange={update('location')} className="input-field" placeholder="e.g. Gulshan, Karachi" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-brand-ink">Short bio</span>
              <textarea
                value={form.bio}
                onChange={update('bio')}
                rows={3}
                className="input-field resize-none"
                placeholder="What you do, and why customers should book you"
              />
            </label>
            <p className="rounded-xl bg-brand-marigold/10 px-3 py-2.5 text-xs text-[#a35e00]">
              New provider profiles are reviewed by an admin before they appear in search.
            </p>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-ink/55">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-indigo">
          Log in
        </Link>
      </p>
    </div>
  );
}
