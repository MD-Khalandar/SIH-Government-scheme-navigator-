import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Navbar, Sidebar, StatCard, SchemeCard, LoadingState, EmptyState } from '../components';
import { schemeService } from '../services/schemeService';
import { eligibilityService } from '../services/eligibilityService';
import { Gift, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      // Load schemes
      const schemesRes = await schemeService.getSchemes();
      
      // Load saved schemes
      const savedRes = await schemeService.getSavedSchemes();
      setSavedSchemes(savedRes.data.map(s => s.id));

      // Get user profile data for eligibility matching
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

      // Get eligibility summary
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
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex-1">
            <LoadingState message="Loading your benefits..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar title="Dashboard" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Greeting */}
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-gray-900">
                Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Here are the benefits Sahayak found for you.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
                {error}
              </div>
            )}

            {/* Summary Cards */}
            {summary && (
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <StatCard
                  label="Potentially Eligible"
                  value={summary.highMatch}
                  icon={CheckCircle2}
                  color="green"
                />
                <StatCard
                  label="Needs More Info"
                  value={summary.needsMore}
                  icon={AlertCircle}
                  color="yellow"
                />
                <StatCard
                  label="Total Schemes"
                  value={summary.totalSchemes}
                  icon={Gift}
                  color="blue"
                />
                <StatCard
                  label="Potential Benefit"
                  value={formatCurrency(summary.potentialBenefit)}
                  icon={FileText}
                  color="purple"
                  trend="Demo data only"
                />
              </div>
            )}

            {/* Important Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-12">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> These are demo schemes for demonstration purposes. The potential benefit values shown are examples and do not represent actual government commitments. Final eligibility is determined by the respective government authorities.
              </p>
            </div>

            {/* Top Matches */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Your Top Matches</h2>
                <button
                  onClick={() => navigate('/app/my-benefits')}
                  className="text-brand-blue hover:text-brand-navy font-semibold"
                >
                  View All →
                </button>
              </div>

              {schemes.length === 0 ? (
                <EmptyState
                  icon={Gift}
                  title="No schemes matched"
                  description="Update your profile to find more relevant schemes"
                  action={() => navigate('/app/profile')}
                  actionLabel="Update Profile"
                />
              ) : (
                <div className="grid gap-6">
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
