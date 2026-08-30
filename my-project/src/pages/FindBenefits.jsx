import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, Button, Input, Select, SchemeCard, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { Search } from 'lucide-react';

export const FindBenefits = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    category: '',
    ministry: ''
  });
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
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Find Benefits" />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Government Benefits</h1>

            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Search schemes"
                  placeholder="Enter scheme name, ministry, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <Select
                  label="State"
                  placeholder="All states"
                  value={filters.state}
                  onChange={(e) => setFilters(prev => ({...prev, state: e.target.value}))}
                  options={[
                    { label: 'Karnataka', value: 'karnataka' },
                    { label: 'Maharashtra', value: 'maharashtra' },
                    { label: 'Delhi', value: 'delhi' }
                  ]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Select
                  label="Category"
                  placeholder="All categories"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
                  options={[
                    { label: 'Education', value: 'education' },
                    { label: 'Employment', value: 'employment' },
                    { label: 'Agriculture', value: 'agriculture' }
                  ]}
                />

                <Select
                  label="Ministry"
                  placeholder="All ministries"
                  value={filters.ministry}
                  onChange={(e) => setFilters(prev => ({...prev, ministry: e.target.value}))}
                  options={[
                    { label: 'Education', value: 'education' },
                    { label: 'Labour', value: 'labour' },
                    { label: 'Agriculture', value: 'agriculture' }
                  ]}
                />
              </div>

              <Button fullWidth>
                Search Schemes
              </Button>
            </form>

            {results === null ? <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-gray-700">
                Use the search filters to browse and discover government schemes that may be relevant to you.
              </p>
            </div> : loading ? <p className="text-center text-gray-600">Searching schemes…</p> : results.length === 0 ? <EmptyState icon={Search} title="No schemes found" description="Try a broader search or clear one of the filters." /> : <div className="grid gap-6">
              <p className="text-sm text-gray-600">{results.length} scheme{results.length === 1 ? '' : 's'} found</p>
              {results.map((scheme) => <SchemeCard key={scheme.id} scheme={scheme} eligibility={{ matchPercentage: 0 }} onViewDetails={() => navigate(`/app/schemes/${scheme.id}`)} onSave={() => schemeService.saveScheme(scheme.id)} />)}
            </div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindBenefits;
