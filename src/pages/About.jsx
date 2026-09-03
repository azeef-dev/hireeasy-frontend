import { Link } from 'react-router-dom';
import { Handshake, Scale, Home } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const STATS = [
    { label: 'Verified providers', value: '500+' },
    { label: 'Jobs completed', value: '12k+' },
    { label: 'Cities covered', value: '6' },
    { label: 'Avg. rating', value: '4.8★' },
];

const VALUES = [
    { title: 'Trust first', desc: 'Every provider goes through manual verification before they can take a single booking.', Icon: Handshake, color: '#0F9B8E' },
    { title: 'Fair for everyone', desc: 'Transparent pricing for customers, consistent work for providers — no middlemen games.', Icon: Scale, color: '#FFB020' },
    { title: 'Local roots', desc: 'Built for Pakistani households first, understanding how services actually get booked here.', Icon: Home, color: '#2B2F79' },
];

export default function About() {
    return (
        <div>
            <section className="relative overflow-hidden bg-brand-indigo py-20 text-center">
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-marigold/20 blur-3xl" aria-hidden />
                <div className="relative mx-auto max-w-2xl px-5">
                    <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
                        About HireEasy
                    </span>
                    <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                        We're fixing how Pakistan finds trusted help
                    </h1>
                    <p className="mt-4 text-white/70">
                        HireEasy started with a simple frustration: finding a decent electrician or plumber
                        shouldn't mean scrolling through ten-year-old WhatsApp groups.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-16">
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                    {STATS.map((s) => (
                        <div key={s.label} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                            <p className="text-2xl font-bold text-brand-ink">{s.value}</p>
                            <p className="mt-1 text-xs text-brand-ink/50">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="mx-auto max-w-6xl px-5">
                    <SectionHeading
                        eyebrow="Our story"
                        title="From a frustrating call-out to a full platform"
                        subtitle="A small team of engineers and service industry folks who got tired of the status quo."
                    />
                    <div className="mt-10 grid grid-cols-1 gap-6 text-sm leading-relaxed text-brand-ink/65 lg:grid-cols-2">
                        <p>
                            It started when one of our founders spent an entire Sunday calling six different
                            "recommended" electricians, none of whom picked up, before one finally showed up —
                            three hours late, with no idea what the job even was.
                        </p>
                        <p>
                            We realized the problem wasn't a lack of good tradespeople — it was a lack of a
                            simple way to find, vet, and book them. So we built HireEasy: a place where every
                            provider is checked before they go live, every booking is tracked start to finish,
                            and every review comes from a real completed job.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-16">
                <SectionHeading eyebrow="What we stand for" title="Our values" />
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {VALUES.map((v) => (
                        <div key={v.title} className="rounded-2xl border border-brand-ink/8 bg-white p-6">
                            <span
                                className="flex h-12 w-12 items-center justify-center rounded-full"
                                style={{ backgroundColor: `${v.color}1A` }}
                            >
                                <v.Icon size={22} style={{ color: v.color }} strokeWidth={1.8} />
                            </span>
                            <p className="mt-4 font-semibold text-brand-ink">{v.title}</p>
                            <p className="mt-1.5 text-sm text-brand-ink/55">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 pb-20">
                <div className="rounded-3xl bg-brand-ink px-8 py-12 text-center sm:px-16">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">Want to be part of the story?</h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-white/65">
                        Whether you need help around the house or you're ready to grow your business —
                        HireEasy has a place for you.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/"
                            className="rounded-full bg-brand-marigold px-6 py-3 text-sm font-semibold text-brand-ink hover:brightness-105"
                        >
                            Browse providers
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                            Become a provider
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}