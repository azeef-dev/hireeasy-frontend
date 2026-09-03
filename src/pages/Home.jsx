import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getProviders, getCategories } from '../api/providers';
import ProviderCard from '../components/ProviderCard';
import ProviderCardSkeleton from '../components/ProviderCardSkeleton';
import FilterDropdown from '../components/FilterDropdown';

export default function Home() {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
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
    const t = setTimeout(fetchProviders, 300); // debounce search typing
    return () => clearTimeout(t);
  }, [fetchProviders]);

  const categoryOptions = categories.map((c) => ({ id: c, label: c }));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-indigo">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-marigold/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-teal/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <h1 className="max-w-xl text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            Skip the WhatsApp forwards.
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/70">
            Book a local service pro who's rated, priced upfront, and trackable from request to
            done — no more chasing numbers someone's cousin gave you.
          </p>

          <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl sm:flex-row sm:items-center">
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
              className="!bg-brand-paper sm:!bg-brand-paper"
            />
          </div>

          {categoryOptions.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {categoryOptions.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id === category ? '' : c.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    category === c.id
                      ? 'bg-brand-marigold text-brand-ink'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Provider grid */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-ink">
              {category ? category : 'All'} providers near you
            </h2>
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
            <p className="text-brand-ink font-medium">No providers match that yet</p>
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
    </div>
  );
}
