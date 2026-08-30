import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, Button, Input, Select } from '../components';
import { useProfile } from '../contexts/ProfileContext';
import { schemeService } from '../services/schemeService';

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
    setFormData(prev => ({ ...prev, [field]: value }));
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

    // 1. Sync to global context for Dashboard consumption
    if (updateProfile) {
      updateProfile(userProfile);
    }

    try {
      // 2. Fetch directly from Firestore service
      const result = await schemeService.getEligibleSchemes(userProfile);
      if (result.success) {
        setEligibleSchemes(result.data);
      }
    } catch (error) {
      console.error("Error evaluating eligibility:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#c9f3ce] text-[#14341e] font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Eligibility Profile" />

        <main className="flex-1 p-6 md:p-12 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Demographics</span>
              <h1 className="text-3xl font-light text-[#14341e] tracking-tight mt-1">Check Your Scheme Eligibility</h1>
              <p className="text-sm text-[#14341e]/70 mt-1 font-light">
                Enter your demographic details to discover government benefits tailored specifically to you.
              </p>
            </div>

            {/* Profile Input Form */}
            <form onSubmit={handleCheckEligibility} className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-sm space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Age"
                  type="number"
                  placeholder="e.g. 25"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  required
                />
                <Input
                  label="Annual Family Income (₹)"
                  type="number"
                  placeholder="e.g. 150000"
                  value={formData.income}
                  onChange={(e) => handleChange('income', e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  options={[
                    { label: 'All / Any', value: 'All' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Male', value: 'Male' },
                    { label: 'Other', value: 'Other' }
                  ]}
                />

                <Select
                  label="Category / Caste"
                  value={formData.caste}
                  onChange={(e) => handleChange('caste', e.target.value)}
                  options={[
                    { label: 'General / All', value: 'All' },
                    { label: 'OBC', value: 'OBC' },
                    { label: 'SC', value: 'SC' },
                    { label: 'ST', value: 'ST' }
                  ]}
                />

                <Select
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  options={[
                    { label: 'All States / Pan-India', value: 'All' },
                    { label: 'Karnataka', value: 'Karnataka' },
                    { label: 'Maharashtra', value: 'Maharashtra' },
                    { label: 'Delhi', value: 'Delhi' }
                  ]}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#177e4f] text-white font-medium hover:bg-[#14341e] transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Evaluating Eligibility...' : 'Find Matching Schemes'}
              </button>
            </form>

            {/* Results Display */}
            {eligibleSchemes !== null && (
              <div className="space-y-4 pt-4">
                <h2 className="text-2xl font-light text-[#14341e]">
                  Matching Benefits ({eligibleSchemes.length})
                </h2>

                {eligibleSchemes.length === 0 ? (
                  <div className="bg-white/40 backdrop-blur-md border border-white/70 rounded-3xl p-8 text-center">
                    <p className="text-[#14341e]/80 font-light">
                      No matching schemes found for the given criteria. Try adjusting your income or location parameters.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eligibleSchemes.map((scheme) => (
                      <div key={scheme.id} className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="inline-block bg-[#177e4f]/10 text-[#177e4f] text-xs px-3 py-1 rounded-full font-semibold uppercase mb-2">
                            {scheme.category || 'General'}
                          </span>
                          <h3 className="text-xl font-bold text-[#14341e]">{scheme.name}</h3>
                          <p className="text-[#14341e]/70 mt-1 text-sm font-light">{scheme.benefits || scheme.description}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/app/schemes/${scheme.id}`)}
                          className="px-6 py-2.5 rounded-full bg-[#177e4f] text-white text-xs font-normal hover:bg-[#14341e] transition shadow-sm whitespace-nowrap"
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