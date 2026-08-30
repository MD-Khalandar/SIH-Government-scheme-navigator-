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
      const userProfile = {
        age: profile?.age || null,
        gender: profile?.gender || null,
        income: profile?.income || null,
        student: profile?.studying === 'yes',
        employmentStatus: profile?.occupation || null,
        occupation: profile?.occupation || null,
        ownLand: profile?.ownLand === 'yes',
        landholding: profile?.landholding || null,
        disability: profile?.disability === 'yes',
        disabilityPercentage: profile?.disability === 'yes' ? 40 : 0
      };

      // 3. Get eligibility summary securely
      const summaryRes = await eligibilityService.getEligibilitySummary(userProfile, allSchemes);
      
      if (summaryRes && summaryRes.data) {
        setSummary(summaryRes.data);
        setSchemes(Array.isArray(summaryRes.data.schemes) ? summaryRes.data.schemes : []);
      } else {
        setSchemes([]);
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
    if (!user?.uid) return;
    try {
      if (savedSchemes.includes(schemeId)) {
        await schemeService.removeSavedScheme(user.uid, schemeId);
        setSavedSchemes(prev => prev.filter(id => id !== schemeId));
      } else {
        await schemeService.saveScheme(user.uid, schemeId);
        setSavedSchemes(prev => [...prev, schemeId]);
      }
    } catch (err) {
      console.error("Error toggling saved scheme:", err);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 shadow-sm">
                  <div className="flex items-center justify-between text-[#177e4f] mb-3">
                    <span className="text-xs font-light text-[#14341e]/60">Potentially Eligible</span>
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-3xl font-light text-[#14341e]">{summary.highMatch}</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 shadow-sm">
                  <div className="flex items-center justify-between text-amber-700 mb-3">
                    <span className="text-xs font-light text-[#14341e]/60">Needs More Info</span>
                    <AlertCircle size={18} />
                  </div>
                  <p className="text-3xl font-light text-[#14341e]">{summary.needsMore}</p>
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