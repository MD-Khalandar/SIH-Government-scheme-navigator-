import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, Button, Input, Select } from '../components';

export const FindBenefits = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    category: '',
    ministry: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality would be implemented here
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-gray-700">
                Use the search filters to browse and discover government schemes that may be relevant to you.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindBenefits;
