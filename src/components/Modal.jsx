import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-brand-ink/50 transition hover:bg-brand-paper hover:text-brand-ink"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        {title && <h2 className="mb-5 pr-10 text-lg font-semibold text-brand-ink">{title}</h2>}
        {children}
      </div>
    </div>
  );
}