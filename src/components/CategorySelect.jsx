import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Wrench } from 'lucide-react';

export default function CategorySelect({ value, onChange, options, placeholder = 'Select a category', error }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex w-full items-center justify-between rounded-xl border bg-white py-2.5 pl-9 pr-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-marigold/20 ${error ? 'border-brand-coral' : 'border-brand-ink/10 focus:border-brand-marigold'
                    }`}
            >
                <span className={value ? 'text-brand-ink' : 'text-brand-ink/35'}>{value || placeholder}</span>
                <ChevronDown size={15} className={`shrink-0 text-brand-ink/40 transition ${open ? 'rotate-180' : ''}`} />
            </button>
            <Wrench size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/35" />

            {open && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-brand-ink/10 bg-white shadow-lg">
                    <ul className="max-h-52 overflow-y-auto py-1.5">
                        {options.map((opt) => (
                            <li key={opt}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(opt);
                                        setOpen(false);
                                    }}
                                    className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-brand-paper ${value === opt ? 'bg-brand-marigold/10 font-semibold text-brand-ink' : 'text-brand-ink/80'
                                        }`}
                                >
                                    {opt}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}