import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, SchemeCard, LoadingState, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { useProfile } from '../contexts/ProfileContext';
import { Gift } from 'lucide-react';

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
      const savedIds = savedRes.data.map(s => s.id);
      setSavedSchemes(savedIds);

      const demoProfile = {
        age: 28,
        gender: 'female',
        state: 'karnataka',
        income: 250000,
        occupation: 'student',
        ownLand: false,
        landholding: 0,
        disability: false,
        urban: 'urban',
        socialCategory: 'general',
        dependents: 0,
        children: 0
      };

      const userProfile = {
        ...demoProfile,
        age: profile?.age ?? demoProfile.age,
        gender: profile?.gender ?? demoProfile.gender,
        state: profile?.state ?? demoProfile.state,
        income: profile?.income ?? demoProfile.income,
        occupation: profile?.occupation ?? demoProfile.occupation,
        ownLand: profile?.ownLand ?? demoProfile.ownLand,
        landholding: profile?.landholding ?? demoProfile.landholding,
        disability: profile?.disability ?? demoProfile.disability,
        urban: profile?.urban ?? demoProfile.urban,
        socialCategory: profile?.socialCategory ?? demoProfile.socialCategory,
        dependents: profile?.dependents ?? demoProfile.dependents,
        children: profile?.children ?? demoProfile.children
      };

      const matched = await import('../services/eligibilityService.js').then(({ eligibilityService }) =>
        eligibilityService.getMatchingSchemes(userProfile, schemesRes.data)
      );

      let list = filter === 'saved' ? savedRes.data : matched.data.filter(s => s.eligibility.matchPercentage >= 50);
      const enriched = list.map(scheme => ({
        ...scheme,
        eligibility: scheme.eligibility || {
          matchPercentage: 55,
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
        setSavedSchemes(prev => prev.filter(id => id !== schemeId));
      } else {
        await schemeService.saveScheme(schemeId);
        setSavedSchemes(prev => [...prev, schemeId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-[#c9f3ce]">
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
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="My Benefits" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Catalog</span>
                <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">Matched Schemes</h1>
              </div>

              <div className="flex gap-2">
                {[
                  { label: 'All Matches', value: 'all' },
                  { label: 'Bookmarked', value: 'saved' }
                ].map(btn => (
                  <button
                    key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className={`px-4 py-1.5 rounded-full text-xs transition duration-200 ${
                      filter === btn.value
                        ? 'bg-[#177e4f] text-white shadow-sm'
                        : 'bg-white/50 text-[#14341e]/80 border border-[#a9c7b1]/40 hover:bg-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {schemes.length === 0 ? (
              <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/70 p-12 text-center">
                <EmptyState
                  icon={Gift}
                  title="No schemes matched"
                  description="Revise your profile criteria to capture more departmental provisions"
                  action={() => navigate('/app/profile')}
                  actionLabel="Update Criteria"
                />
              </div>
            ) : (
              <div className="grid gap-5">
                {schemes.map(scheme => (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyBenefits;