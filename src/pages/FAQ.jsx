import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import FaqAccordion from '../components/FaqAccordion';
import { FAQS } from '../utils/faqs';

export default function FAQ() {
    return (
        <div>
            <section className="relative overflow-hidden bg-brand-indigo py-16 text-center">
                <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand-teal/20 blur-3xl" aria-hidden />
                <div className="relative mx-auto max-w-xl px-5">
                    <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">FAQs</span>
                    <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Frequently asked questions</h1>
                    <p className="mt-3 text-white/70">Can't find what you're looking for? Reach out to us directly.</p>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-5 py-16">
                <SectionHeading eyebrow="Help center" title="Everything you need to know" />
                <div className="mt-8">
                    <FaqAccordion items={FAQS} />
                </div>
                <div className="mt-10 rounded-2xl bg-white p-6 text-center shadow-sm">
                    <p className="font-semibold text-brand-ink">Still have questions?</p>
                    <p className="mt-1 text-sm text-brand-ink/55">Our team is happy to help.</p>
                    <Link
                        to="/contact"
                        className="mt-4 inline-block rounded-full bg-brand-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-indigo"
                    >
                        Contact us
                    </Link>
                </div>
            </section>
        </div>
    );
}