import { Dropdown } from '@heroui/react';

/**
 * A labeled dropdown built on HeroUI's Dropdown (Menu) primitive.
 * options: [{ id: string, label: string }]
 */
export default function FilterDropdown({ label, value, options, onChange, className = '' }) {
  const selected = options.find((o) => o.id === value);

  return (
    <Dropdown>
      <Dropdown.Trigger
        className={`flex items-center gap-2 rounded-full border border-brand-ink/10 bg-white px-4 py-2.5 text-sm font-medium text-brand-ink transition hover:border-brand-ink/25 data-pressed:scale-[0.98] ${className}`}
      >
        <span className="text-brand-ink/50">{label}:</span>
        <span>{selected ? selected.label : 'All'}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-brand-ink/40">
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-50 rounded-2xl border border-brand-ink/10 bg-white p-1.5 shadow-lg">
        <Dropdown.Menu
          onAction={(key) => onChange(key === '__all__' ? '' : String(key))}
        >
          <Dropdown.Item
            id="__all__"
            className="cursor-pointer rounded-xl px-3 py-2 text-sm text-brand-ink data-hovered:bg-brand-paper data-focused:bg-brand-paper"
          >
            All
          </Dropdown.Item>
          {options.map((opt) => (
            <Dropdown.Item
              key={opt.id}
              id={opt.id}
              className="cursor-pointer rounded-xl px-3 py-2 text-sm text-brand-ink data-hovered:bg-brand-paper data-focused:bg-brand-paper"
            >
              {opt.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
