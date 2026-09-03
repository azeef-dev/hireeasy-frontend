import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="text-6xl font-bold text-brand-indigo">404</p>
      <h1 className="mt-3 text-xl font-semibold text-brand-ink">This page went on a job elsewhere</h1>
      <p className="mt-2 text-sm text-brand-ink/55">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-indigo">
        Back home
      </Link>
    </div>
  );
}
