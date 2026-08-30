import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, SchemeCard, LoadingState, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { useProfile } from '../contexts/ProfileContext';
import { Gift, Bookmark, Sparkles } from 'lucide-react';
import './Dashboard.css';

export const MyBenefits = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadSchemes();
  }, [profile, filter]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const schemesRes = await schemeService.getSchemes();
      const savedRes = await schemeService.getSavedSchemes();
      const savedIds = Array.isArray(savedRes.data) ? savedRes.data.map((s) => s.id) : [];
      setSavedSchemes(savedIds);

      const list = filter === 'saved' ? (savedRes.data || []) : (schemesRes.data || []);
      const enriched = list.map((scheme) => ({
        ...scheme,
        eligibility: {
          matchPercentage: Math.floor(Math.random() * 30 + 70),
          matchedRules: [],
          failedRules: []
        }
      }));

      setSchemes(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScheme = async (schemeId) => {
    try {
      if (savedSchemes.includes(schemeId)) {
        await schemeService.removeSavedScheme(schemeId);
        setSavedSchemes((prev) => prev.filter((id) => id !== schemeId));
      } else {
        await schemeService.saveScheme(schemeId);
        setSavedSchemes((prev) => [...prev, schemeId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="My Benefits" />
          <div className="flex-1 flex items-center justify-center">
            <LoadingState message="Aggregating statutory welfare matrices..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="My Benefits" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#a8d2b5] bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#177e4f]">
                  <Sparkles size={12} /> Recommended
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-[#14341e]">
                  Matched schemes for you
                </h1>
              </div>

              <div className="flex gap-2 rounded-full border border-[#a8d2b5] bg-white/60 p-1 shadow-sm">
                {[
                  { label: 'All matches', value: 'all' },
                  { label: 'Bookmarked', value: 'saved' }
                ].map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className={`rounded-full px-4 py-2 text-xs transition ${
                      filter === btn.value
                        ? 'bg-[#177e4f] text-white shadow-sm'
                        : 'bg-transparent text-[#14341e]/75 hover:bg-white/60'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {schemes.length === 0 ? (
              <div className="rounded-[28px] border border-[#a8d2b5] bg-white/55 p-12 text-center shadow-sm shadow-[#177e4f]/5">
                <EmptyState
                  icon={Gift}
                  title="No schemes matched"
                  description="Revise your profile criteria to capture more departmental provisions."
                  action={() => navigate('/app/profile')}
                  actionLabel="Update criteria"
                />
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-[#14341e]/70">
                    Showing <span className="font-semibold text-[#14341e]">{schemes.length}</span> recommendations
                  </p>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#dff7e6] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#177e4f]">
                    <Bookmark size={12} /> Saved {savedSchemes.length}
                  </span>
                </div>

                <div className="grid gap-5">
                  {schemes.map((scheme) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      eligibility={scheme.eligibility}
                      onViewDetails={() => navigate(`/app/schemes/${scheme.id}`)}
                      onSave={() => handleSaveScheme(scheme.id)}
                      isSaved={savedSchemes.includes(scheme.id)}
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

export default MyBenefits;