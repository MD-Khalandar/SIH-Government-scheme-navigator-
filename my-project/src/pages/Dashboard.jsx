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
      const schemesRes = await schemeService.getSchemes();
      const savedRes = await schemeService.getSavedSchemes();
      setSavedSchemes(savedRes.data.map(s => s.id));

      const demoProfile = {
        age: 28,
        gender: 'female',
        state: 'karnataka',
        district: 'Bengaluru',
        urban: 'urban',
        income: 250000,
        socialCategory: 'general',
        student: true,
        occupation: 'student',
        employmentStatus: 'student',
        ownLand: false,
        landholding: 0,
        dependents: 0,
        children: 0,
        disability: false,
        disabilityPercentage: 0,
        lookingForWork: 'no',
        ownHouse: false,
        seniorCitizens: 0,
        bpl: 'no'
      };

      const userProfile = {
        ...demoProfile,
        age: profile?.age ?? demoProfile.age,
        gender: profile?.gender ?? demoProfile.gender,
        state: profile?.state ?? demoProfile.state,
        district: profile?.district ?? demoProfile.district,
        urban: profile?.urban ?? demoProfile.urban,
        income: profile?.income ?? demoProfile.income,
        socialCategory: profile?.socialCategory ?? demoProfile.socialCategory,
        student: profile?.studying === 'yes' || profile?.occupation === 'student' || demoProfile.student,
        employmentStatus: profile?.occupation ?? demoProfile.occupation,
        occupation: profile?.occupation ?? demoProfile.occupation,
        ownLand: profile?.ownLand === 'yes' || profile?.ownLand === true || demoProfile.ownLand,
        landholding: profile?.landholding ?? demoProfile.landholding,
        dependents: profile?.dependents ?? demoProfile.dependents,
        children: profile?.children ?? demoProfile.children,
        disability: profile?.disability === 'yes' || profile?.disability === true || demoProfile.disability,
        disabilityPercentage: profile?.disability === 'yes' || profile?.disability === true ? 40 : demoProfile.disabilityPercentage,
        lookingForWork: profile?.lookingForWork ?? demoProfile.lookingForWork,
        ownHouse: profile?.ownHouse ?? demoProfile.ownHouse,
        seniorCitizens: profile?.seniorCitizens ?? demoProfile.seniorCitizens,
        bpl: profile?.bpl ?? demoProfile.bpl
      };

      const summaryRes = await eligibilityService.getEligibilitySummary(userProfile, schemesRes.data);
      setSummary(summaryRes.data);
      setSchemes(summaryRes.data.schemes);
    } catch (err) {
      setError(err.message);
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
                    <span className="text-xs font-light text-[#14341e]/60">Applyable</span>
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