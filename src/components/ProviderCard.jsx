import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProviderCard({ provider }) {
  const initial = provider.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <Link
      to={`/providers/${provider._id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(23,25,51,0.06),0_8px_24px_rgba(23,25,51,0.06)] transition hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(23,25,51,0.08),0_16px_32px_rgba(23,25,51,0.1)]"
    >
      <div className="flex items-start gap-3 p-5 pb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-indigo text-lg font-semibold text-white">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-brand-ink">{provider.name}</p>
          <p className="truncate text-sm text-brand-ink/55">{provider.location || 'Karachi'}</p>
          <div className="mt-1.5">
            <StarRating value={provider.rating || 0} size={14} />
          </div>
        </div>
      </div>

      <div className="px-5">
        <span className="inline-block rounded-full bg-brand-marigold/15 px-3 py-1 text-xs font-semibold text-[#a35e00]">
          {provider.serviceCategory}
        </span>
      </div>

      <div className="relative mt-5 ticket-notch-bottom pb-0">
        <div className="ticket-dashed-divider mx-5" />
      </div>

      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-xs text-brand-ink/45">Starting at</p>
          <p className="font-semibold text-brand-ink">
            {provider.price ? `Rs ${provider.price.toLocaleString()}` : 'Ask for quote'}
          </p>
        </div>
        <div>
          <p className="text-xs text-brand-ink/45">Experience</p>
          <p className="font-semibold text-brand-ink">{provider.experience || 0} yrs</p>
        </div>
        <span className="rounded-full bg-brand-ink px-3.5 py-2 text-xs font-semibold text-white transition group-hover:bg-brand-indigo">
          View profile
        </span>
      </div>
    </Link>
  );
}
