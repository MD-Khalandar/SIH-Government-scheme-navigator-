import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, Input, Select, SchemeCard, EmptyState } from '../components';
import { Search } from 'lucide-react';
import { schemeService } from '../services/schemeService';

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
    const query = searchQuery.trim().toLowerCase();
    try {
      const { data } = await schemeService.getSchemes();
      const filtered = data.filter((scheme) => {
        const searchable = `${scheme.name} ${scheme.description} ${scheme.category} ${scheme.ministry}`.toLowerCase();
        const matchesQuery = !query || searchable.includes(query);
        const matchesState = !filters.state || scheme.state === 'All India' || scheme.state.toLowerCase() === filters.state;
        const matchesCategory = !filters.category || scheme.category.toLowerCase() === filters.category;
        const matchesMinistry = !filters.ministry || scheme.ministry.toLowerCase().includes(filters.ministry);
        return matchesQuery && matchesState && matchesCategory && matchesMinistry;
      });
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Find Benefits" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Database</span>
              <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">Discover Schemes</h1>
            </div>

            <form onSubmit={handleSearch} className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 space-y-5 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Search parameters"
                  placeholder="Scheme designation, key provisions, nodal body..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                  label="State Jurisdiction"
                  placeholder="All Territories"
                  value={filters.state}
                  onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                  options={[
                    { label: 'Karnataka', value: 'karnataka' },
                    { label: 'Maharashtra', value: 'maharashtra' },
                    { label: 'Delhi', value: 'delhi' }
                  ]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Classification"
                  placeholder="All sectors"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  options={[
                    { label: 'Education & Research', value: 'education' },
                    { label: 'Employment & Skilling', value: 'employment' },
                    { label: 'Agriculture & Agritech', value: 'agriculture' }
                  ]}
                />
                <Select
                  label="Ministry / Department"
                  placeholder="All Authorities"
                  value={filters.ministry}
                  onChange={(e) => setFilters(prev => ({ ...prev, ministry: e.target.value }))}
                  options={[
                    { label: 'Education', value: 'education' },
                    { label: 'Labour & Employment', value: 'labour' },
                    { label: 'Agriculture & Farmers Welfare', value: 'agriculture' }
                  ]}
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#177e4f] text-white text-xs font-normal hover:bg-[#14341e] transition shadow-sm"
              >
                <Search size={14} className="text-[#4ae278]" />
                <span>Search Directives</span>
              </button>
            </form>

            {results === null ? (
              <div className="rounded-2xl bg-white/30 backdrop-blur-sm border border-[#a9c7b1]/40 p-5 text-center">
                <p className="text-xs text-[#14341e]/70 font-light leading-relaxed">
                  Filter and inspect central gazettes and state notifications without registration requirements.
                </p>
              </div>
            ) : loading ? (
              <p className="text-center text-gray-600">Searching schemes…</p>
            ) : results.length === 0 ? (
              <EmptyState icon={Search} title="No schemes found" description="Try a broader search or clear one of the filters." />
            ) : (
              <div className="grid gap-6">
                <p className="text-sm text-gray-600">{results.length} scheme{results.length === 1 ? '' : 's'} found</p>
                {results.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    eligibility={{ matchPercentage: 0 }}
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