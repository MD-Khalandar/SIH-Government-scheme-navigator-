import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Navbar, Sidebar, StatCard, SchemeCard, LoadingState, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { eligibilityService } from '../services/eligibilityService';
import { Gift, FileText, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedSchemes, setSavedSchemes] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, [profile]);

 const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch schemes and saved schemes with safeguards
      const schemesRes = await schemeService.getSchemes();
      const savedRes = await schemeService.getSavedSchemes(user?.uid);

      const allSchemes = Array.isArray(schemesRes?.data) ? schemesRes.data : [];
      const savedList = Array.isArray(savedRes?.data) ? savedRes.data.map(s => s.schemeId || s.id) : [];
      setSavedSchemes(savedList);

      // 2. Format user profile
      const hasProfileData = profile && Object.values(profile).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'number') return value > 0;
        const normalized = String(value).trim().toLowerCase();
        return normalized !== '' && normalized !== 'select' && normalized !== 'any' && normalized !== 'not applicable';
      });

      const userProfile = {
        age: profile?.age || 0,
        gender: profile?.gender || 'Any',
        income: profile?.income || 100000000,
        student: profile?.studying === 'Yes',
        employmentStatus: profile?.occupation || 'Any',
        occupation: profile?.occupation || 'Any',
        ownLand: profile?.ownLand === 'Yes',
        landholding: profile?.landholding || 0,
        disability: profile?.disability === 'Yes',
        disabilityPercentage: profile?.disability === 'Yes' ? 40 : 0
      };

      // 3. If the profile is still empty, show the full scheme catalog instead of empty eligibility cards.
      if (!hasProfileData) {
        const fallbackSummary = {
          totalSchemes: allSchemes.length,
          highMatch: allSchemes.length,
          fullyMatched: allSchemes.length,
          needsMore: 0,
          lowMatch: 0,
          potentialBenefit: allSchemes.reduce((sum, scheme) => sum + (scheme.benefit?.amount || 0), 0),
          schemes: allSchemes
        };
        setSummary(fallbackSummary);
        setSchemes(fallbackSummary.schemes);
      } else {
        const summaryRes = await eligibilityService.getEligibilitySummary(userProfile, allSchemes);

        if (summaryRes && summaryRes.data) {
          setSummary(summaryRes.data);
          setSchemes(Array.isArray(summaryRes.data.schemes) ? summaryRes.data.schemes : []);
        } else {
          setSummary({ totalSchemes: allSchemes.length, highMatch: 0, fullyMatched: 0, needsMore: 0, lowMatch: allSchemes.length, potentialBenefit: 0, schemes: [] });
          setSchemes([]);
        }
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(err.message);
      setSchemes([]);
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
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <LoadingState message="Matching optimal citizen benefits..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Dashboard" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            {/* Greeting */}
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Overview</span>
              <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">
                Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name?.split(' ')[0] || 'Citizen'}
              </h1>
              <p className="text-sm sm:text-base text-[#14341e]/70 font-light mt-1">
                Here are the benefits matched to your demographic profile.
              </p>
            </div>

            {error && (
              <div className="bg-rose-50/80 border border-rose-200 text-rose-800 text-xs px-5 py-3 rounded-2xl mb-8">
                {error}
              </div>
            )}

            {/* Metric Capsules */}
            {summary && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 shadow-sm">
                  <div className="flex items-center justify-between text-[#177e4f] mb-3">
                    <span className="text-xs font-light text-[#14341e]/60">Potentially Eligible</span>
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-3xl font-light text-[#14341e]">{summary.highMatch}</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 shadow-sm">
                  <div className="flex items-center justify-between text-[#177e4f] mb-3">
                    <span className="text-xs font-light text-[#14341e]/60">Total Schemes</span>
                    <Gift size={18} />
                  </div>
                  <p className="text-3xl font-light text-[#14341e]">{summary.totalSchemes}</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 shadow-sm">
                  <div className="flex items-center justify-between text-[#177e4f] mb-3">
                    <span className="text-xs font-light text-[#14341e]/60">Potential Benefit</span>
                    <FileText size={18} />
                  </div>
                  <p className="text-3xl font-light text-[#14341e]">{formatCurrency(summary.potentialBenefit)}</p>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-2xl bg-white/30 backdrop-blur-sm border border-[#a9c7b1]/40 p-4 mb-10">
              <p className="text-xs text-[#14341e]/70 font-light leading-relaxed">
                Demo simulation for demonstration purposes. Computed eligibility values indicate rule matches and do not represent final statutory allocations.
              </p>
            </div>

            {/* Schemes List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-light text-[#14341e]">Your Top Matches</h2>
                <button
                  onClick={() => navigate('/app/my-benefits')}
                  className="text-xs font-light text-[#177e4f] hover:text-[#14341e] transition"
                >
                  View All →
                </button>
              </div>

              {schemes.length === 0 ? (
                <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/70 p-12 text-center">
                  <EmptyState
                    icon={Gift}
                    title="No schemes matched"
                    description="Update your profile to expand your matches"
                    action={() => navigate('/app/profile')}
                    actionLabel="Update Profile"
                  />
                </div>
              ) : (
                <div className="grid gap-5">
                  {schemes.slice(0, 3).map(scheme => (
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;