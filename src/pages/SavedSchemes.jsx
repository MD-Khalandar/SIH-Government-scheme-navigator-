import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, SchemeCard, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { Bookmark } from 'lucide-react';

export const SavedSchemes = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSchemes();
  }, []);

  const loadSavedSchemes = async () => {
    try {
      const res = await schemeService.getSavedSchemes();
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (schemeId) => {
    try {
      await schemeService.removeSavedScheme(schemeId);
      setSchemes(prev => prev.filter(s => s.id !== schemeId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Saved Schemes" />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Schemes</h1>

            {schemes.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No saved schemes"
                description="Save schemes to track them later"
                action={() => navigate('/app/my-benefits')}
                actionLabel="Browse Schemes"
              />
            ) : (
              <div className="grid gap-6">
                {schemes.map(scheme => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    eligibility={{ matchPercentage: 75 }}
                    onViewDetails={() => navigate(`/app/schemes/${scheme.id}`)}
                    onSave={() => handleRemove(scheme.id)}
                    isSaved={true}
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

export default SavedSchemes;
