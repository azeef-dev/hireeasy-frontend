import {
    Zap,
    Wrench,
    Sparkles,
    PaintBucket,
    Hammer,
    BookOpen,
    Settings,
    Flower2,
} from 'lucide-react';

const CATEGORY_ICONS = {
    Electrical: Zap,
    Plumbing: Wrench,
    Cleaning: Sparkles,
    Painting: PaintBucket,
    Carpentry: Hammer,
    Tutoring: BookOpen,
    'Appliance Repair': Settings,
    Gardening: Flower2,
};

export default function CategoryCard({ category, active, onClick }) {
    const Icon = CATEGORY_ICONS[category.value] || Wrench;

    return (
        <button
            onClick={onClick}
            className={`group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition hover:-translate-y-1 hover:shadow-lg ${active
                ? 'border-brand-ink bg-brand-ink text-white'
                : 'border-brand-ink/8 bg-white text-brand-ink'
                }`}
        >
            <span
                className="flex h-14 w-14 items-center justify-center rounded-full transition group-hover:scale-110"
                style={{
                    backgroundColor: active ? 'rgba(255,255,255,0.15)' : category.bgColor,
                }}
            >
                <Icon
                    size={26}
                    style={{ color: active ? '#ffffff' : category.color }}
                    strokeWidth={1.8}
                />
            </span>
            <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-brand-ink'}`}>
                {category.name}
            </span>
        </button>
    );
}