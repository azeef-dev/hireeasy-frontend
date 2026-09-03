import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProviders, getCategories } from '../api/providers';
import ProviderCard from '../components/ProviderCard';
import ProviderCardSkeleton from '../components/ProviderCardSkeleton';
import FilterDropdown from '../components/FilterDropdown';
import SectionHeading from '../components/SectionHeading';
import CategoryCard from '../components/CategoryCard';
import TestimonialCard from '../components/TestimonialCard';
import FaqAccordion from '../components/FaqAccordion';
import { CATEGORIES } from '../utils/categories';
import { TESTIMONIALS } from '../utils/testimonials';
import { FAQS } from '../utils/faqs';

const STATS = [
  { label: 'Verified providers', value: '500+' },
  { label: 'Jobs completed', value: '12k+' },
  { label: 'Avg. rating', value: '4.8★' },
  { label: 'Cities covered', value: '6' },
];

const STEPS = [
  { title: 'Search & compare', desc: 'Browse categories or search by service, name, or area to find the right pro.', icon: '🔍' },
  { title: 'Book in seconds', desc: 'Pick a date, time and share what you need — no back-and-forth calls.', icon: '📅' },
  { title: 'Track live status', desc: 'Follow your booking from requested to accepted to completed.', icon: '📍' },
  { title: 'Pay & review', desc: 'Pay the provider directly, then rate your experience for others.', icon: '⭐' },
];

const WHY_US = [
  { title: 'Verified professionals', desc: 'Every provider is manually reviewed before they can take bookings.', icon: '✅', color: '#0F9B8E' },
  { title: 'Transparent pricing', desc: 'See starting prices upfront — no surprise call-out fees.', icon: '💰', color: '#FFB020' },
  { title: 'Real reviews', desc: 'Ratings come only from customers who actually booked the service.', icon: '💬', color: '#F0553F' },
  { title: 'Fast response', desc: 'Most providers respond to booking requests within the hour.', icon: '⚡', color: '#2B2F79' },
];

export default function Home() {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => { });
  }, []);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProviders({ search: search || undefined, category: category || undefined });
      setProviders(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(fetchProviders, 300);
    return () => clearTimeout(t);
  }, [fetchProviders]);

  const categoryOptions = categories.map((c) => ({ id: c, label: c }));

  const scrollToProviders = () => {
    document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-brand-indigo">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-marigold/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-teal/20 blur-3xl" aria-hidden />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
          {/* Left: illustration */}
          <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-white/5" aria-hidden />
              <img
                src="/images/hero-team.png"
                alt="Team of verified service professionals — electrician, plumber, painter and cleaner"
                className="relative w-full drop-shadow-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Right: copy + search */}
          <div className="order-1 lg:order-2">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
              Trusted by 12,000+ customers
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-white sm:text-5xl">Skip the WhatsApp forwards.</h1>
            <p className="mt-4 max-w-md text-lg text-white/70">
              Book a local service pro who's rated, priced upfront, and trackable from request to done — no more
              chasing numbers someone's cousin gave you.
            </p>

            <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by service, name, or area..."
                className="w-full flex-1 rounded-xl border-0 bg-brand-paper px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:ring-2 focus:ring-brand-marigold sm:bg-transparent sm:px-2"
              />
              <FilterDropdown
                label="Category"
                value={category}
                options={categoryOptions}
                onChange={setCategory}
                className="bg-brand-paper! sm:bg-brand-paper!"
              />
              <button
                onClick={scrollToProviders}
                className="shrink-0 rounded-xl bg-brand-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo-dark sm:rounded-full"
              >
                Search
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-white sm:text-2xl">{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          eyebrow="Popular categories"
          title="Whatever the job, there's a pro for it"
          subtitle="Tap a category to instantly filter providers near you."
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryCard
              key={c.value}
              category={c}
              active={category === c.value}
              onClick={() => {
                setCategory(category === c.value ? '' : c.value);
                scrollToProviders();
              }}
            />
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS (mini) ---------------- */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="How it works"
            title="Booking help shouldn't be a hassle"
            subtitle="From search to a job well done, in four simple steps."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative rounded-2xl bg-brand-paper p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  {step.icon}
                </span>
                <p className="mt-4 text-xs font-semibold text-brand-marigold">STEP {i + 1}</p>
                <p className="mt-1 font-semibold text-brand-ink">{step.title}</p>
                <p className="mt-1.5 text-sm text-brand-ink/55">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/how-it-works" className="text-sm font-semibold text-brand-indigo hover:underline">
              Learn more about how HireEasy works →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- PROVIDER GRID ---------------- */}
      <section id="providers" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-ink">{category ? category : 'All'} providers near you</h2>
            <p className="mt-1 text-sm text-brand-ink/50">
              {loading ? 'Loading…' : `${providers.length} provider${providers.length === 1 ? '' : 's'} found`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProviderCardSkeleton key={i} />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-ink/15 bg-white py-16 text-center">
            <p className="font-medium text-brand-ink">No providers match that yet</p>
            <p className="mt-1 text-sm text-brand-ink/50">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p) => (
              <ProviderCard key={p._id} provider={p} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Why HireEasy"
            title="Built so you never have to guess"
            subtitle="We handle the vetting, tracking, and accountability so you don't have to."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-brand-ink/8 p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                  style={{ backgroundColor: `${item.color}1A` }}
                >
                  {item.icon}
                </span>
                <p className="mt-4 font-semibold text-brand-ink">{item.title}</p>
                <p className="mt-1.5 text-sm text-brand-ink/55">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Testimonials" title="Loved by customers and providers alike" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </section>

      {/* ---------------- FAQ PREVIEW ---------------- */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-5">
          <SectionHeading eyebrow="FAQs" title="Got questions?" />
          <div className="mt-8">
            <FaqAccordion items={FAQS.slice(0, 4)} />
          </div>
          <div className="mt-6 text-center">
            <Link to="/faq" className="text-sm font-semibold text-brand-indigo hover:underline">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- BECOME A PROVIDER CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-ink px-8 py-12 text-center sm:px-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-brand-marigold/10 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-brand-teal/10 blur-3xl" aria-hidden />
          <h2 className="relative text-2xl font-bold text-white sm:text-3xl">
            Are you an electrician, plumber, or cleaner?
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/65">
            Join HireEasy to get consistent bookings from customers actively looking for your service — no cold
            calling required.
          </p>
          <Link
            to="/register"
            className="relative mt-6 inline-block rounded-full bg-brand-marigold px-7 py-3 text-sm font-semibold text-brand-ink transition hover:brightness-105"
          >
            Become a provider
          </Link>
        </div>
      </section>
    </div>
  );
}