import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.name.split(' ')[0]}`);
      navigate(DASHBOARD_PATH[data.role] || '/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-2xl font-bold text-brand-ink">Log in</h1>
      <p className="mt-1 text-sm text-brand-ink/55">Good to see you again.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand-ink">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-brand-ink/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-marigold"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-brand-ink">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-xl border border-brand-ink/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-marigold"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-ink/55">
        New here?{' '}
        <Link to="/register" className="font-semibold text-brand-indigo">
          Create an account
        </Link>
      </p>
    </div>
  );
}
