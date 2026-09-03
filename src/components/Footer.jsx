export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-ink/5 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-brand-ink/50">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-indigo text-xs font-bold text-white">
              H
            </span>
            <span className="font-semibold text-brand-ink">HireEasy</span>
          </div>
          <p>Book trusted local help, without the WhatsApp forwards.</p>
        </div>
      </div>
    </footer>
  );
}
