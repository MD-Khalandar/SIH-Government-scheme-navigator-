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
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Saved Schemes" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Bookmarks</span>
              <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">Bookmarked Directives</h1>
            </div>

            {schemes.length === 0 ? (
              <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/70 p-12 text-center">
                <EmptyState
                  icon={Bookmark}
                  title="No schemes pinned"
                  description="Save welfare policies from search results to monitor deadlines"
                  action={() => navigate('/app/my-benefits')}
                  actionLabel="Browse Schemes"
                />
              </div>
            ) : (
              <div className="grid gap-5">
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