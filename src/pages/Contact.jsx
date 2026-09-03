import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const CONTACT_INFO = [
    { label: 'Email us', value: 'support@hireeasy.com', Icon: Mail, color: '#2B2F79' },
    { label: 'Call us', value: '+92 300 1234567', Icon: Phone, color: '#0F9B8E' },
    { label: 'Visit us', value: 'Shahrah-e-Faisal, Karachi', Icon: MapPin, color: '#F0553F' },
];

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon.");
            setForm({ name: '', email: '', message: '' });
            setSubmitting(false);
        }, 600);
    };

    return (
        <div>
            <section className="relative overflow-hidden bg-brand-indigo py-16 text-center">
                <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand-teal/20 blur-3xl" aria-hidden />
                <div className="relative mx-auto max-w-xl px-5">
                    <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
                        Contact us
                    </span>
                    <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                        We'd love to hear from you
                    </h1>
                    <p className="mt-3 text-white/70">
                        Questions, feedback, or partnership ideas — drop us a line and we'll respond within a
                        business day.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-5 py-16">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
                    <div>
                        <SectionHeading align="left" eyebrow="Get in touch" title="Here's how to reach us" />
                        <div className="mt-8 flex flex-col gap-4">
                            {CONTACT_INFO.map((c) => (
                                <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                    <span
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                                        style={{ backgroundColor: `${c.color}1A` }}
                                    >
                                        <c.Icon size={20} style={{ color: c.color }} strokeWidth={1.8} />
                                    </span>
                                    <div>
                                        <p className="text-xs text-brand-ink/45">{c.label}</p>
                                        <p className="font-medium text-brand-ink">{c.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-brand-ink">Full name</span>
                            <input
                                required
                                value={form.name}
                                onChange={update('name')}
                                className="input-field"
                                placeholder="Your name"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-brand-ink">Email</span>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={update('email')}
                                className="input-field"
                                placeholder="you@example.com"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-brand-ink">Message</span>
                            <textarea
                                required
                                rows={5}
                                value={form.message}
                                onChange={update('message')}
                                className="input-field resize-none"
                                placeholder="How can we help?"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:opacity-50"
                        >
                            {submitting ? 'Sending…' : 'Send message'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}