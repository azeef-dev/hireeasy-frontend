import { useState } from 'react';

export default function FaqAccordion({ items }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="flex flex-col gap-3">
            {items.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                    <div
                        key={item.question}
                        className={`overflow-hidden rounded-2xl border transition ${isOpen ? 'border-brand-marigold/40 bg-white' : 'border-brand-ink/8 bg-white'
                            }`}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? -1 : i)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                            <span className="text-sm font-semibold text-brand-ink sm:text-base">{item.question}</span>
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-paper text-brand-ink/60 transition-transform ${isOpen ? 'rotate-45 bg-brand-marigold text-brand-ink' : ''
                                    }`}
                            >
                                +
                            </span>
                        </button>
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <p className="px-5 pb-5 text-sm leading-relaxed text-brand-ink/60">{item.answer}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}