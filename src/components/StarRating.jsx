export default function StarRating({ value = 0, size = 16, showValue = true }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
        {stars.map((s) => (
          <svg
            key={s}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill={s <= Math.round(value) ? '#FFB020' : '#E4E4EC'}
          >
            <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7L10 1.5z" />
          </svg>
        ))}
      </span>
      {showValue && <span className="text-sm text-brand-ink/60">{value ? value.toFixed(1) : 'New'}</span>}
    </span>
  );
}
