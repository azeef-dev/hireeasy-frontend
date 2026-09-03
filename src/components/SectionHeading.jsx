export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
    const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto';
    return (
        <div className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
            {eyebrow && (
                <span className="rounded-full bg-brand-marigold/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#a35e00]">
                    {eyebrow}
                </span>
            )}
            <h2 className="text-3xl font-bold text-brand-ink sm:text-4xl">{title}</h2>
            {subtitle && <p className="text-base text-brand-ink/55">{subtitle}</p>}
        </div>
    );
}