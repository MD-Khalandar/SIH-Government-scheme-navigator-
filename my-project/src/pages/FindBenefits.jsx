import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, SchemeCard, EmptyState } from '../components';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { schemeService } from '../services/schemeService';
import dataAtWorkIllustration from '../assets/undraw_data-at-work_3tbf.svg';
import './Dashboard.css';

const normalizeText = (value = '') => String(value).toLowerCase().trim();

export const FindBenefits = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ state: '', category: '', ministry: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const query = normalizeText(searchQuery);
      const { data = [] } = await schemeService.getSchemes();

      const filtered = data.filter((scheme) => {
        const searchable = [
          scheme.name,
          scheme.description,
          scheme.category,
          scheme.ministry,
          scheme.state,
          scheme.benefit?.type,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matchesQuery = !query || searchable.includes(query);
        const matchesState =
          !filters.state ||
          normalizeText(scheme.state).includes(normalizeText(filters.state)) ||
          normalizeText(filters.state).includes(normalizeText(scheme.state)) ||
          normalizeText(scheme.state) === 'all india';
        const matchesCategory =
          !filters.category || normalizeText(scheme.category) === normalizeText(filters.category);
        const matchesMinistry =
          !filters.ministry || normalizeText(scheme.ministry).includes(normalizeText(filters.ministry));

        return matchesQuery && matchesState && matchesCategory && matchesMinistry;
      });

      setResults(filtered);
    } catch (error) {
      console.error('Error searching schemes:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Find Benefits" />

        <main className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full find-benefits-badge px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Sparkles size={13} className="text-[#177e4f]" />
                  <span>Public Scheme Registry</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#061b0d] sm:text-4xl">
                  Find Entitlements
                </h1>
                <p className="mt-1 text-xs font-medium text-[#0a2e14] sm:text-sm">
                  Search through active state and central government welfare directives.
                </p>
              </div>

              <img
                src={dataAtWorkIllustration}
                alt="Data at work illustration"
                className="h-20 w-auto opacity-90 sm:h-24"
              />
            </div>

            <form
              onSubmit={handleSearch}
              className="find-benefits-glass-card mb-8 rounded-[2rem] p-6 sm:p-8"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[#0a2e14]">
                    Search Keywords
                  </label>
                  <input
                    type="text"
                    placeholder="Scheme title, ministry, grant, or benefit keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="find-benefits-input w-full rounded-xl px-4 py-3 text-xs font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[#0a2e14]">
                    State Jurisdiction
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters((prev) => ({ ...prev, state: e.target.value }))}
                    className="find-benefits-input w-full rounded-xl px-4 py-3 text-xs font-semibold outline-none"
                  >
                    <option value="">All States & Territories</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="delhi">Delhi</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                    <option value="uttar-pradesh">Uttar Pradesh</option>
                    <option value="all india">All India / Central</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[#0a2e14]">
                    Sector Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                    className="find-benefits-input w-full rounded-xl px-4 py-3 text-xs font-semibold outline-none"
                  >
                    <option value="">All Sectors</option>
                    <option value="education & research">Education & Research</option>
                    <option value="employment & skill development">Employment & Skill Development</option>
                    <option value="agriculture & rural development">Agriculture & Rural Development</option>
                    <option value="health & wellness">Health & Wellness</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-[0.18em] text-[#0a2e14]">
                    Nodal Department
                  </label>
                  <select
                    value={filters.ministry}
                    onChange={(e) => setFilters((prev) => ({ ...prev, ministry: e.target.value }))}
                    className="find-benefits-input w-full rounded-xl px-4 py-3 text-xs font-semibold outline-none"
                  >
                    <option value="">All Ministries</option>
                    <option value="ministry of education">Ministry of Education</option>
                    <option value="ministry of labour and employment">Ministry of Labour and Employment</option>
                    <option value="department of agriculture">Department of Agriculture</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-[#061b0d]/10 pt-4 sm:flex-row">
                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-[#061b0d]">
                  <span className="rounded-full bg-[#177e4f]/10 px-2.5 py-1 text-[#177e4f]">Demographic-first</span>
                  <span className="rounded-full bg-[#177e4f]/10 px-2.5 py-1 text-[#177e4f]">State-aware</span>
                  <span className="rounded-full bg-[#177e4f]/10 px-2.5 py-1 text-[#177e4f]">Zero-Broker</span>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#061b0d] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#c9f3ce] shadow-md transition-all duration-300 hover:bg-[#177e4f] hover:text-white sm:w-auto"
                >
                  <Search size={14} className="text-[#4ae278]" />
                  <span>Execute Search</span>
                </button>
              </div>
            </form>

            {results === null ? (
              <div className="find-benefits-glass-card rounded-[2rem] p-8 text-center">
                <p className="text-sm font-semibold text-[#0a2e14]/80">
                  Enter criteria or select filters above to query statutory schemes and entitlements.
                </p>
              </div>
            ) : loading ? (
              <div className="find-benefits-glass-card rounded-[2rem] p-10 text-center text-sm font-bold text-[#061b0d]">
                Evaluating policy databases...
              </div>
            ) : results.length === 0 ? (
              <div className="find-benefits-glass-card rounded-[2rem] p-12 text-center">
                <EmptyState
                  icon={Search}
                  title="No direct directives found"
                  description="Try broadening your keywords or selecting 'All States' to widen scheme parameters."
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-bold text-[#0a2e14]">
                    Identified <span className="text-[#177e4f]">{results.length}</span> matching assistance program{results.length === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="grid gap-4">
                  {results.map((scheme) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      eligibility={{ matchPercentage: 0 }}
                      onViewDetails={() => navigate(`/app/schemes/${scheme.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindBenefits;