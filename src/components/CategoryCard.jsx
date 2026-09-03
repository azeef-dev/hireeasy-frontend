export default function CategoryCard({ category, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition hover:-translate-y-1 hover:shadow-lg ${active ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-ink/8 bg-white text-brand-ink'
                }`}
        >
            <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl transition group-hover:scale-110"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.15)' : `${category.color}22` }}
            >
                {category.icon}
            </span>
            <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-brand-ink'}`}>{category.name}</span>
        </button>
    );
}