const STEPS = [
  { key: 'pending', label: 'Requested' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
];

export default function StatusTracker({ status }) {
  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-brand-coral">
        <span className="h-2 w-2 rounded-full bg-brand-coral" />
        Declined by provider
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  done
                    ? 'bg-brand-teal text-white'
                    : active
                      ? 'bg-brand-marigold text-brand-ink'
                      : 'bg-brand-ink/10 text-brand-ink/40'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${active ? 'text-brand-ink' : 'text-brand-ink/40'}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1.5 mb-4 h-0.5 w-8 sm:w-12 ${done ? 'bg-brand-teal' : 'bg-brand-ink/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
