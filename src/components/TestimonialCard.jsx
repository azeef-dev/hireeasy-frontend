import StarRating from './StarRating';

export default function TestimonialCard({ testimonial }) {
    const initial = testimonial.name.charAt(0).toUpperCase();
    return (
        <div className="flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(23,25,51,0.06),0_8px_24px_rgba(23,25,51,0.06)]">
            <StarRating value={testimonial.rating} showValue={false} size={16} />
            <p className="flex-1 text-sm leading-relaxed text-brand-ink/70">&quot;{testimonial.comment}&quot;</p>
            <div className="flex items-center gap-3 pt-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-indigo text-sm font-semibold text-white">
                    {initial}
                </span>
                <div>
                    <p className="text-sm font-semibold text-brand-ink">{testimonial.name}</p>
                    <p className="text-xs text-brand-ink/50">{testimonial.role}</p>
                </div>
            </div>
        </div>
    );
}