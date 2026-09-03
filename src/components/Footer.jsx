import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Send, Heart, Sparkles } from 'lucide-react';

const FOOTER_LINKS = {
  'For customers': [
    { label: 'Browse providers', href: '/' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Track a booking', href: '/dashboard' },
    { label: 'FAQs', href: '/faq' },
  ],
  'For providers': [
    { label: 'Become a provider', href: '/register' },
    { label: 'Provider dashboard', href: '/provider/dashboard' },
    { label: 'How it works', href: '/how-it-works' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy policy', href: '/contact' },
    { label: 'Terms of service', href: '/contact' },
  ],
};

const SOCIAL_LINKS = [
  {
    label: 'WhatsApp',
    href: '#',
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.5.6.2 1 .4 1.3.5.6.2 1.1.1 1.5-.1.5-.2 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: <path d="M14 9h2.5V6H14c-1.9 0-3.5 1.6-3.5 3.5V11H8v3h2.5v6h3v-6H16l.5-3h-3V9.6c0-.3.3-.6.5-.6Z" />,
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're on the list! We'll keep you posted.");
    setEmail('');
  };

  return (
    <footer className="mt-20 border-t border-brand-ink/5 bg-white">
      {/* CTA strip */}
      <div className="relative overflow-hidden bg-brand-indigo">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-marigold/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-brand-teal/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-xl font-bold text-white">Need something done around the house?</p>
            <p className="mt-1 text-sm text-white/70">Browse verified providers and book in a couple of taps.</p>
          </div>
          <Link
            to="/"
            className="shrink-0 rounded-full bg-brand-marigold px-6 py-3 text-sm font-semibold text-brand-ink transition hover:brightness-105"
          >
            Browse providers
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* Newsletter Box */}
        <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-brand-paper p-6 sm:flex-row sm:p-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-marigold/20 text-brand-ink">
                <Sparkles size={18} className="text-[#a35e00]" />
              </span>
              <p className="text-lg font-bold text-brand-ink">Get handy tips & offers</p>
            </div>
            <p className="mt-1 text-sm text-brand-ink/55">
              Once in a while, no spam — just useful stuff for your home.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/35" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-brand-ink/10 bg-white py-3 pl-10 pr-4 text-sm text-brand-ink placeholder:text-brand-ink/35 focus:border-brand-marigold focus:outline-none focus:ring-2 focus:ring-brand-marigold/20"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 shrink-0 rounded-2xl bg-brand-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo"
            >
              <span>Subscribe</span>
              <Send size={15} />
            </button>
          </form>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-indigo text-sm font-bold text-white">
                H
              </span>
              <span className="text-lg font-bold tracking-tight text-brand-ink">HireEasy</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-ink/55">
              Book trusted local help — plumbers, electricians, cleaners and more — without the endless WhatsApp
              forwards.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-paper text-brand-ink/60 transition hover:bg-brand-marigold/20 hover:text-brand-ink"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-sm font-semibold text-brand-ink">{heading}</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-sm text-brand-ink/55 transition hover:text-brand-indigo">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ticket-dashed-divider mt-12" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-brand-ink/45 sm:flex-row">
          <p>© {new Date().getFullYear()} HireEasy. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={13} className="fill-brand-coral text-brand-coral inline" /> in Karachi
          </p>
        </div>
      </div>
    </footer>
  );
}