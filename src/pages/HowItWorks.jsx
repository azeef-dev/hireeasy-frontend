import { useState } from 'react';
import { Link } from 'react-router-dom';

const CUSTOMER_STEPS = [
    { title: 'Search or browse', desc: 'Look up a service category or search by name, area, or keyword.', icon: '🔍' },
    { title: 'Compare providers', desc: 'Check ratings, experience, starting prices, and reviews before deciding.', icon: '📋' },
    { title: 'Book instantly', desc: 'Pick your date, time and location, and describe what you need done.', icon: '📅' },
    { title: 'Track your booking', desc: 'Watch the status move from requested → accepted → in progress → completed.', icon: '📍' },
    { title: 'Pay & review', desc: 'Pay the provider directly once the job is done, then leave a rating.', icon: '⭐' },
];

const PROVIDER_STEPS = [
    { title: 'Create your profile', desc: 'Sign up as a provider and add your category, experience, and pricing.', icon: '📝' },
    { title: 'Get verified', desc: 'Our admin team manually reviews and approves your profile — usually within 24 hours.', icon: '✅' },
    { title: 'Receive bookings', desc: 'Customers looking for your service can find and book you directly.', icon: '📬' },
    { title: 'Accept & deliver', desc: 'Accept requests you can take, mark progress, and complete the job.', icon: '🛠️' },
    { title: 'Get rated', desc: 'Build your reputation with real reviews from completed bookings.', icon: '🌟' },
];

export default function HowItWorks() {
    const [tab, setTab] = useState('customer');
    const steps = tab === 'customer' ? CUSTOMER_STEPS : PROVIDER_STEPS;

    return (
        <div>
            <section className="relative overflow-hidden bg-brand-indigo py-16 text-center">
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-marigold/20 blur-3xl" aria-hidden />
                <div className="relative mx-auto max-w-xl px-5">
                    <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
                        How it works
                    </span>
                    <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Simple for customers, simple for pros</h1>
                    <p className="mt-3 text-white/70">Whichever side you're on, HireEasy keeps it straightforward.</p>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-5 py-16">
                <div className="mx-auto flex w-fit gap-2 rounded-full bg-white p-1 shadow-sm">
                    {[
                        { id: 'customer', label: "I'm a customer" },
                        { id: 'provider', label: "I'm a provider" },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'bg-brand-ink text-white' : 'text-brand-ink/50 hover:text-brand-ink'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="mt-12 flex flex-col gap-6">
                    {steps.map((step, i) => (
                        <div key={step.title} className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-marigold/15 text-2xl">
                                {step.icon}
                            </span>
                            <div className="pb-2">
                                <p className="text-xs font-semibold text-brand-marigold">STEP {i + 1}</p>
                                <p className="mt-1 font-semibold text-brand-ink">{step.title}</p>
                                <p className="mt-1.5 text-sm text-brand-ink/55">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        to={tab === 'customer' ? '/' : '/register'}
                        className="inline-block rounded-full bg-brand-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo"
                    >
                        {tab === 'customer' ? 'Browse providers' : 'Become a provider'}
                    </Link>
                </div>
            </section>
        </div>
    );
}