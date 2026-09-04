import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, User, MessageSquare, AlertCircle, Send, Loader2 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { validateName, validateEmail, validateMessage, isFormValid } from '../utils/validators';

const CONTACT_INFO = [
    { label: 'Email us', value: 'support@hireeasy.com', Icon: Mail, color: '#2B2F79' },
    { label: 'Call us', value: '+92 300 1234567', Icon: Phone, color: '#0F9B8E' },
    { label: 'Visit us', value: 'Shahrah-e-Faisal, Karachi', Icon: MapPin, color: '#F0553F' },
];

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validateFieldByName = (field, value) => {
        if (field === 'name') return validateName(value);
        if (field === 'email') return validateEmail(value);
        if (field === 'message') return validateMessage(value);
        return '';
    };

    const update = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const handleBlur = (field) => () => {
        setErrors((prev) => ({ ...prev, [field]: validateFieldByName(field, form[field]) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            name: validateName(form.name),
            email: validateEmail(form.email),
            message: validateMessage(form.message),
        };
        setErrors(newErrors);

        if (!isFormValid(newErrors)) {
            toast.error('Please fix the highlighted fields');
            return;
        }

        setSubmitting(true);
        // No backend endpoint for contact yet — simulate a submission.
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon.");
            setForm({ name: '', email: '', message: '' });
            setErrors({});
            setSubmitting(false);
        }, 600);
    };

    const errorText = (field) =>
        errors[field] ? (
            <span className="flex items-center gap-1 text-xs text-brand-coral">
                <AlertCircle size={12} /> {errors[field]}
            </span>
        ) : null;

    return (
        <div>
            <section className="relative overflow-hidden bg-brand-indigo py-16 text-center">
                <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand-teal/20 blur-3xl" aria-hidden />
                <div className="relative mx-auto max-w-xl px-5">
                    <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
                        Contact us
                    </span>
                    <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">We'd love to hear from you</h1>
                    <p className="mt-3 text-white/70">
                        Questions, feedback, or partnership ideas — drop us a line and we'll respond within a business day.
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

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold tracking-wide text-brand-ink/70">FULL NAME</label>
                            <div className="relative flex items-center">
                                <User size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                                <input
                                    value={form.name}
                                    onChange={update('name')}
                                    onBlur={handleBlur('name')}
                                    className={`w-full rounded-xl border bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.name
                                        ? 'border-brand-coral focus:ring-brand-coral/20'
                                        : 'border-brand-ink/10 focus:border-brand-marigold focus:ring-brand-marigold/20'
                                        }`}
                                    placeholder="Your name"
                                />
                            </div>
                            {errorText('name')}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold tracking-wide text-brand-ink/70">EMAIL</label>
                            <div className="relative flex items-center">
                                <Mail size={17} className="pointer-events-none absolute left-3.5 text-brand-ink/35" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={update('email')}
                                    onBlur={handleBlur('email')}
                                    className={`w-full rounded-xl border bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.email
                                        ? 'border-brand-coral focus:ring-brand-coral/20'
                                        : 'border-brand-ink/10 focus:border-brand-marigold focus:ring-brand-marigold/20'
                                        }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errorText('email')}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold tracking-wide text-brand-ink/70">MESSAGE</label>
                            <div className="relative">
                                <MessageSquare size={17} className="pointer-events-none absolute left-3.5 top-3.5 text-brand-ink/35" />
                                <textarea
                                    rows={5}
                                    value={form.message}
                                    onChange={update('message')}
                                    onBlur={handleBlur('message')}
                                    className={`w-full resize-none rounded-xl border bg-brand-paper/50 py-2.5 pl-10 pr-3 text-sm text-brand-ink placeholder:text-brand-ink/35 transition focus:bg-white focus:outline-none focus:ring-2 ${errors.message
                                        ? 'border-brand-coral focus:ring-brand-coral/20'
                                        : 'border-brand-ink/10 focus:border-brand-marigold focus:ring-brand-marigold/20'
                                        }`}
                                    placeholder="How can we help?"
                                />
                            </div>
                            {errorText('message')}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand-ink py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Sending…
                                </>
                            ) : (
                                <>
                                    <Send size={15} /> Send message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}