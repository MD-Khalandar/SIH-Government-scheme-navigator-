import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Navbar, Sidebar, SchemeCard, LoadingState, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { eligibilityService } from '../services/eligibilityService';
import { 
  Gift, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import './Dashboard.css';

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
      const savedRes = await schemeService.getSavedSchemes(user?.uid);

      const allSchemes = Array.isArray(schemesRes?.data) ? schemesRes.data : [];
      const savedList = Array.isArray(savedRes?.data) ? savedRes.data.map(s => s.schemeId || s.id) : [];
      setSavedSchemes(savedList);

      // 2. Format user profile
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
      <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <LoadingState message="Matching optimal citizen benefits..." />
          </div>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-page-canvas flex min-h-screen w-full text-[#061b0d] font-dashboard selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar title="Dashboard" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-8 sm:py-10">
          <div className="w-full max-w-7xl mx-auto">
            
            {/* Header Greeting Banner */}
            <div className="dashboard-greeting mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#177e4f]/15 text-[#061b0d] text-xs font-bold uppercase tracking-wider border border-[#177e4f]/25 mb-3">
                <Sparkles size={14} className="text-[#177e4f]" />
                <span>Eligibility Assessment Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                {greeting}, {user?.name?.split(' ')[0] || 'Citizen'}
              </h1>
              <p className="text-sm sm:text-base text-[#0a2e14] font-medium mt-1">
                Verified entitlements matched against current state and national directives.
              </p>
            </div>

            {error && (
              <div className="bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold px-5 py-3 rounded-2xl mb-8 shadow-sm flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
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
                  <p className="text-3xl font-extrabold text-[#061b0d] tracking-tight">{summary.highMatch}</p>
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
                  <p className="text-3xl font-extrabold text-[#061b0d] tracking-tight">{summary.totalSchemes}</p>
                </div>

                {/* Estimated Cumulative Value */}
                <div className="dashboard-metric-capsule p-6 rounded-3xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a2e14]/75">Estimated Value</span>
                    <div className="w-8 h-8 rounded-xl bg-[#177e4f]/15 text-[#177e4f] flex items-center justify-center">
                      <FileText size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-[#061b0d] tracking-tight">
                    {formatCurrency(summary.potentialBenefit)}
                  </p>
                </div>
              </div>
            )}

            {/* Informational Assurance Notice */}
            <div className="dashboard-notice-card rounded-2xl p-4 sm:p-5 mb-10 flex items-start gap-3.5">
              <ShieldCheck size={20} className="text-[#177e4f] flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-[#0a2e14] leading-relaxed">
                Eligible results indicate algorithmically evaluated rule matches. Official sanctioning and disbursement are conducted strictly through authorized government nodal desks without fees or commercial intermediary involvement.
              </p>
            </div>

            {/* Schemes Section */}
            <div className="dashboard-schemes-section">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#061b0d] tracking-tight">
                    Recommended Schemes
                  </h2>
                  <p className="text-xs font-medium text-[#0a2e14] mt-0.5">
                    Highest scoring assistance programs based on your demographics
                  </p>
                </div>

                <button
                  onClick={() => navigate('/app/my-benefits')}
                  className="text-xs font-bold text-[#177e4f] hover:text-[#061b0d] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>View All Entitlements</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {schemes.length === 0 ? (
                <div className="dashboard-glass-card rounded-3xl p-12 text-center">
                  <EmptyState
                    icon={Gift}
                    title="No schemes currently matched"
                    description="Expand or update your eligibility profile criteria to identify potential welfare programs."
                    action={() => navigate('/app/profile')}
                    actionLabel="Update Citizen Profile"
                  />
                </div>
              ) : (
                <div className="dashboard-scheme-list grid gap-5">
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
