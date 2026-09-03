import StatusTracker from './StatusTracker';

const STATUS_STYLES = {
  pending: 'bg-brand-marigold/15 text-[#a35e00]',
  accepted: 'bg-brand-teal/15 text-brand-teal',
  'in-progress': 'bg-brand-indigo/10 text-brand-indigo',
  completed: 'bg-brand-teal text-white',
  rejected: 'bg-brand-coral/15 text-brand-coral',
};

export default function BookingCard({ booking, counterpartLabel, counterpartName, children }) {
  const date = booking.date ? new Date(booking.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) : '';

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(23,25,51,0.06),0_8px_24px_rgba(23,25,51,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5">
        <div>
          <p className="font-mono text-[11px] tracking-wide text-brand-ink/40">{booking.bookingId}</p>
          <p className="mt-0.5 text-base font-semibold text-brand-ink">{booking.service}</p>
          <p className="text-sm text-brand-ink/55">
            {counterpartLabel}: {counterpartName}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[booking.status] || 'bg-brand-ink/10 text-brand-ink/60'}`}
        >
          {booking.status.replace('-', ' ')}
        </span>
      </div>

      <div className="ticket-dashed-divider mx-5" />

      <div className="grid grid-cols-2 gap-3 px-5 py-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs text-brand-ink/45">Date</p>
          <p className="font-medium text-brand-ink">{date}</p>
        </div>
        <div>
          <p className="text-xs text-brand-ink/45">Time</p>
          <p className="font-medium text-brand-ink">{booking.time}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-brand-ink/45">Location</p>
          <p className="truncate font-medium text-brand-ink">{booking.location}</p>
        </div>
      </div>

      {booking.description && (
        <p className="px-5 pb-2 text-sm text-brand-ink/60">{booking.description}</p>
      )}

      <div className="overflow-x-auto px-5 pb-3 pt-1">
        <StatusTracker status={booking.status} />
      </div>

      {children && <div className="flex flex-wrap gap-2 border-t border-brand-ink/5 px-5 py-4">{children}</div>}
    </div>
  );
}
