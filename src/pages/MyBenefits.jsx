import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, SchemeCard, LoadingState, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { eligibilityService } from '../services/eligibilityService';
import { useProfile } from '../contexts/ProfileContext';
import { Gift } from 'lucide-react';

export const MyBenefits = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [filter, setFilter] = useState('all'); // all, matched, saved

  useEffect(() => {
    loadSchemes();
  }, [profile, filter]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const schemesRes = await schemeService.getSchemes();
      
      let filtered = schemesRes.data;
      
      if (filter === 'saved') {
        const savedRes = await schemeService.getSavedSchemes();
        filtered = savedRes.data;
        setSavedSchemes(savedRes.data.map(s => s.id));
      } else {
        const savedRes = await schemeService.getSavedSchemes();
        setSavedSchemes(savedRes.data.map(s => s.id));
      }

      // Get eligibility for each scheme
      const userProfile = {
        age: profile?.age || null,
        gender: profile?.gender || null,
        income: profile?.income || null,
        student: profile?.studying === 'yes'
      };

      const enriched = filtered.map(scheme => ({
        ...scheme,
        eligibility: {
          matchPercentage: Math.random() * 100,
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
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="My Benefits" />
          <div className="flex-1">
            <LoadingState />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="My Benefits" />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">My Benefits</h1>
              <div className="flex gap-2">
                {[
                  { label: 'All Schemes', value: 'all' },
                  { label: 'Saved', value: 'saved' }
                ].map(btn => (
                  <button
                    key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filter === btn.value
                        ? 'bg-brand-blue text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {schemes.length === 0 ? (
              <EmptyState
                icon={Gift}
                title="No schemes to show"
                description="Try updating your profile to find more schemes"
                action={() => navigate('/app/profile')}
                actionLabel="Update Profile"
              />
            ) : (
              <div className="grid gap-6">
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
