import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar } from '../components';
import { useProfile } from '../contexts/ProfileContext';
import { schemeService } from '../services/schemeService';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import stackedPeaks from '../assets/stacked-peaks-haikei.svg';
import './EligibilityProfile.css';

export const EligibilityProfile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState(null);

  const [formData, setFormData] = useState({
    age: profile?.age || '',
    income: profile?.income || '',
    gender: profile?.gender || 'All',
    caste: profile?.caste || 'All',
    state: profile?.state || 'All'
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userProfile = {
      age: Number(formData.age) || 0,
      income: Number(formData.income) || 0,
      gender: formData.gender,
      caste: formData.caste,
      state: formData.state
    };

    if (updateProfile) {
      updateProfile(userProfile);
    }

    try {
      const result = await schemeService.getEligibleSchemes(userProfile);
      if (result.success) {
        setEligibleSchemes(result.data || []);
      }
    } catch (error) {
      console.error('Error evaluating eligibility:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eligibility-page-canvas flex min-h-screen w-full font-eligibility selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      <div className="absolute bottom-0 left-0 w-full pointer-events-none -z-10 leading-none">
        <img
          src={stackedPeaks}
          alt=""
          aria-hidden="true"
          className="w-full h-auto max-h-[300px] object-cover object-bottom opacity-20 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#c2f0c8]/60 to-transparent" />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Eligibility Profile" />

        <main className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#177e4f]/15 text-[#061b0d] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={13} className="text-[#177e4f]" />
                <span>On-Device Criteria Processing</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                Evaluate Scheme Eligibility
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#0a2e14] mt-1">
                Enter demographic parameters to trigger local algorithmic matching without third-party data tracking.
              </p>
            </div>

            {/* Profile Input Form */}
            <form onSubmit={handleCheckEligibility} className="eligibility-glass-card rounded-[2.5rem] p-8 sm:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0a2e14] block">Age (Completed Years)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="eligibility-input w-full px-4 py-3 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0a2e14] block">Annual Household Income (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={formData.income}
                    onChange={(e) => handleChange('income', e.target.value)}
                    className="eligibility-input w-full px-4 py-3 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0a2e14] block">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="eligibility-input w-full px-4 py-3 rounded-xl text-xs font-semibold"
                  >
                    <option value="All">All / Any</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0a2e14] block">Category / Social Class</label>
                  <select
                    value={formData.caste}
                    onChange={(e) => handleChange('caste', e.target.value)}
                    className="eligibility-input w-full px-4 py-3 rounded-xl text-xs font-semibold"
                  >
                    <option value="All">General / All</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0a2e14] block">State Jurisdiction</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="eligibility-input w-full px-4 py-3 rounded-xl text-xs font-semibold"
                  >
                    <option value="All">All States / Pan-India</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#061b0d] hover:bg-[#177e4f] text-[#c9f3ce] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Evaluating Matched Policies...' : 'Execute Eligibility Match'}</span>
                {!loading && <ArrowRight size={14} className="text-[#4ae278]" />}
              </button>
            </form>

            {/* Results Display */}
            {eligibleSchemes !== null && (
              <div className="space-y-4 pt-2">
                <h2 className="text-xl font-extrabold text-[#061b0d] tracking-tight">
                  Evaluated Entitlements ({eligibleSchemes.length})
                </h2>

                {eligibleSchemes.length === 0 ? (
                  <div className="eligibility-glass-card rounded-[2rem] p-8 text-center">
                    <p className="text-sm font-semibold text-[#0a2e14]">
                      No direct statutory matches under the current criteria. Adjust income or location thresholds to expand screening.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eligibleSchemes.map((scheme) => (
                      <div key={scheme.id} className="eligibility-glass-card rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="inline-block bg-[#177e4f]/15 text-[#177e4f] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                            {scheme.category || 'General'}
                          </span>
                          <h3 className="text-lg font-bold text-[#061b0d]">{scheme.name}</h3>
                          <p className="text-xs font-semibold text-[#0a2e14]/75 mt-1 leading-relaxed">
                            {scheme.benefits || scheme.description}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/app/schemes/${scheme.id}`)}
                          className="px-5 py-2.5 rounded-full bg-[#177e4f] hover:bg-[#061b0d] text-white text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0"
                        >
                          View Details & Apply
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default EligibilityProfile;