import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, SchemeCard, EmptyState } from '../components';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { schemeService } from '../services/schemeService';
import { useProfile } from '../contexts/ProfileContext';
import { eligibilityService } from '../services/eligibilityService';

const normalizeText = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const immediateCauseOptions = [
  { label: 'Child Birth', value: 'child birth' },
  { label: 'Graduate', value: 'graduate' },
  { label: 'Marriage', value: 'marriage' },
  { label: 'Job Loss', value: 'job loss' },
  { label: 'Disability', value: 'disability' },
  { label: 'Housing', value: 'housing' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Business', value: 'business' },
  { label: 'Senior Citizen', value: 'senior citizen' }
];

export const FindBenefits = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ state: '', category: '', ministry: '', immediateCause: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSearch = async (customQuery = searchQuery) => {
    setLoading(true);

    try {
      const { data: schemes } = await schemeService.getSchemes();
      const query = normalizeText(customQuery);
      const queryTokens = query ? query.split(' ').filter(Boolean) : [];
      const activeFilters = Object.values(filters).some(value => String(value || '').trim() !== '');

      if (!query && !activeFilters) {
        setResults(Array.isArray(schemes) ? schemes : []);
        setLoading(false);
        return;
      }

      const userProfile = {
        age: profile?.age ?? 0,
        income: profile?.income ?? 0,
        gender: profile?.gender ?? '',
        occupation: profile?.occupation ?? '',
        studying: profile?.studying ?? '',
        lookingForWork: profile?.lookingForWork ?? '',
        bpl: profile?.bpl ?? '',
        ownLand: profile?.ownLand ?? '',
        disability: profile?.disability ?? '',
        state: profile?.state ?? ''
      };

      const ranked = await eligibilityService.getMatchingSchemes(userProfile, schemes);

      const filtered = ranked
        .map((scheme) => {
          const searchable = [
            scheme.name,
            scheme.description,
            scheme.category,
            scheme.ministry,
            scheme.state,
            ...(scheme.keywords || []),
            ...(scheme.eligibilityCriteria || []),
            ...(scheme.documents || []),
            scheme.immediateCause || ''
          ].join(' ');

          const haystack = normalizeText(searchable);
          let score = 0;

          if (query) {
            if (normalizeText(scheme.name).includes(query)) score += 35;
            if (haystack.includes(query)) score += 18;
            queryTokens.forEach((token) => {
              if (normalizeText(scheme.name).includes(token)) score += 12;
              if (haystack.includes(token)) score += 6;
            });
          } else {
            score = 10;
          }

          if (filters.immediateCause) {
            const causeMatch = normalizeText(scheme.immediateCause || '').includes(normalizeText(filters.immediateCause)) || normalizeText(scheme.name).includes(normalizeText(filters.immediateCause));
            if (causeMatch) score += 20; else score -= 50;
          }

          if (filters.state) {
            const stateMatch = normalizeText(scheme.state).includes(normalizeText(filters.state)) || normalizeText(scheme.state) === 'all india';
            if (stateMatch) score += 10; else score -= 50;
          }

          if (filters.category) {
            const categoryMatch = normalizeText(scheme.category).includes(normalizeText(filters.category));
            if (categoryMatch) score += 10; else score -= 50;
          }

          if (filters.ministry) {
            const ministryMatch = normalizeText(scheme.ministry).includes(normalizeText(filters.ministry));
            if (ministryMatch) score += 8; else score -= 50;
          }

          return { ...scheme, matchScore: score > 0 ? score : 1 };
        })
        .filter((scheme) => {
          if (!query && !activeFilters) {
            return true;
          }

          const searchable = [
            scheme.name,
            scheme.description,
            scheme.category,
            scheme.ministry,
            scheme.state,
            ...(scheme.keywords || []),
            ...(scheme.eligibilityCriteria || []),
            ...(scheme.documents || []),
            scheme.immediateCause || ''
          ].join(' ');

          const haystack = normalizeText(searchable);
          const matchesName = !query || normalizeText(scheme.name).includes(query) || haystack.includes(query);
          const matchesImmediateCause = !filters.immediateCause || normalizeText(scheme.immediateCause || '').includes(normalizeText(filters.immediateCause)) || normalizeText(scheme.name).includes(normalizeText(filters.immediateCause));
          const matchesState = !filters.state || normalizeText(scheme.state).includes(normalizeText(filters.state)) || normalizeText(scheme.state) === 'all india';
          const matchesCategory = !filters.category || normalizeText(scheme.category).includes(normalizeText(filters.category));
          const matchesMinistry = !filters.ministry || normalizeText(scheme.ministry).includes(normalizeText(filters.ministry));
          const matchesQueryTokens = !query || queryTokens.some((token) => haystack.includes(token) || normalizeText(scheme.name).includes(token));

          return matchesName && matchesImmediateCause && matchesState && matchesCategory && matchesMinistry && matchesQueryTokens;
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 60);

      if (!query && !activeFilters) {
        setResults(Array.isArray(schemes) ? schemes : []);
        return;
      }

      setResults(filtered.length ? filtered : []);
    } catch (error) {
      console.error('FindBenefits search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch();
  }, [profile, searchQuery, filters]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await runSearch();
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

            <form onSubmit={handleSearch} className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 space-y-5 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Search by scheme name or keyword"
                  placeholder="Enter scheme name, scholarship, pension, loan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                  label="Immediate Cause"
                  placeholder="Any life event"
                  value={filters.immediateCause}
                  onChange={(e) => setFilters(prev => ({ ...prev, immediateCause: e.target.value }))}
                  options={immediateCauseOptions}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="State Jurisdiction"
                  placeholder="All Territories"
                  value={filters.state}
                  onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                  options={[
                    { label: 'Karnataka', value: 'karnataka' },
                    { label: 'Maharashtra', value: 'maharashtra' },
                    { label: 'Delhi', value: 'delhi' },
                    { label: 'All India', value: 'all india' }
                  ]}
                />
                <Select
                  label="Classification"
                  placeholder="All sectors"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  options={[
                    { label: 'Education & Research', value: 'education' },
                    { label: 'Employment & Skilling', value: 'employment' },
                    { label: 'Agriculture & Agritech', value: 'agriculture' },
                    { label: 'Healthcare', value: 'healthcare' },
                    { label: 'Housing', value: 'housing' }
                  ]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Ministry / Department"
                  placeholder="All Authorities"
                  value={filters.ministry}
                  onChange={(e) => setFilters(prev => ({ ...prev, ministry: e.target.value }))}
                  options={[
                    { label: 'Education', value: 'education' },
                    { label: 'Labour & Employment', value: 'labour' },
                    { label: 'Agriculture & Farmers Welfare', value: 'agriculture' },
                    { label: 'Health & Family Welfare', value: 'health' },
                    { label: 'Social Justice', value: 'social' }
                  ]}
                />
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#177e4f] text-white text-xs font-normal hover:bg-[#14341e] transition shadow-sm"
                  >
                    <Search size={14} className="text-[#4ae278]" />
                    <span>Search Schemes</span>
                  </button>
                </div>
              </div>
            </form>

            {results === null ? (
              <div className="rounded-2xl bg-white/30 backdrop-blur-sm border border-[#a9c7b1]/40 p-5 text-center">
                <p className="text-xs text-[#14341e]/70 font-light leading-relaxed">
                  Review schemes by name, life event, or profile relevance.
                </p>
              </div>
            ) : loading ? (
              <div className="find-benefits-glass-card rounded-[2rem] p-10 text-center text-sm font-bold text-[#061b0d]">
                Evaluating policy databases...
              </div>
            ) : results.length === 0 ? (
              <EmptyState icon={Search} title="No schemes found" description="Try a broader keyword or clear the filters." />
            ) : (
              <div className="grid gap-6">
                <p className="text-sm text-gray-600">{results.length} scheme{results.length === 1 ? '' : 's'} found</p>
                {results.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    eligibility={scheme.eligibility || { matchPercentage: 0 }}
                    onViewDetails={() => navigate(`/app/schemes/${scheme.id}`)}
                    onSave={() => schemeService.saveScheme(scheme.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindBenefits;