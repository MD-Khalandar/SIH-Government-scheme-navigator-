import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, SchemeCard, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { Bookmark, Sparkles } from 'lucide-react';
import './Dashboard.css';

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
      setSchemes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (schemeId) => {
    try {
      await schemeService.removeSavedScheme(schemeId);
      setSchemes((prev) => prev.filter((s) => s.id !== schemeId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Saved Schemes" />
        
        <main className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl">
            
            {/* Header */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#177e4f]/15 text-[#061b0d] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={13} className="text-[#177e4f]" />
                  <span>Pinned Entitlements</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                  Saved Directives
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#0a2e14] mt-1">
                  Monitored grants and welfare programs bookmarked for application.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-white/90 text-xs font-bold text-[#061b0d] shadow-xs">
                <Bookmark size={14} className="text-[#177e4f]" />
                <span>{schemes.length} schemes pinned</span>
              </div>
            </div>

            {loading ? (
              <div className="saved-schemes-glass-card rounded-[2rem] p-10 text-center text-sm font-bold text-[#061b0d] border border-[#a8d2b5] bg-white/55 shadow-sm shadow-[#177e4f]/5">
                Synchronizing pinned schemes...
              </div>
            ) : schemes.length === 0 ? (
              <div className="saved-schemes-glass-card rounded-[2rem] p-12 text-center border border-[#a8d2b5] bg-white/55 shadow-sm shadow-[#177e4f]/5">
                <EmptyState
                  icon={Bookmark}
                  title="No schemes pinned"
                  description="Bookmark welfare policies from search results to monitor deadlines and updates."
                  action={() => navigate('/app/my-benefits')}
                  actionLabel="Browse Schemes"
                />
              </div>
            ) : (
              <div className="grid gap-4">
                {schemes.map((scheme) => (
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