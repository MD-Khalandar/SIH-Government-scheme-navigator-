import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, Button, Input, Select } from '../components';
import schemeService from '../services/schemeService';

export const EligibilityProfile = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState(null);

  const [profile, setProfile] = useState({
    age: '',
    income: '',
    gender: 'All',
    caste: 'All',
    state: 'All'
  });

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userProfile = {
      age: Number(profile.age) || 0,
      income: Number(profile.income) || 0,
      gender: profile.gender,
      caste: profile.caste,
      state: profile.state
    };

    try {
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
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Eligibility Profile" />

        <main className="flex-1 bg-brand-bg p-6 md:p-12 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Check Your Scheme Eligibility</h1>
              <p className="text-gray-600 mt-2">
                Enter your demographic details to discover government benefits tailored specifically to you.
              </p>
            </div>

            {/* Profile Input Form */}
            <form onSubmit={handleCheckEligibility} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  placeholder="e.g. 25"
                  value={profile.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  required
                />
                <Input
                  label="Annual Family Income (₹)"
                  type="number"
                  placeholder="e.g. 150000"
                  value={profile.income}
                  onChange={(e) => handleChange('income', e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Select
                  label="Gender"
                  value={profile.gender}
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
                  value={profile.caste}
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
                  value={profile.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  options={[
                    { label: 'All States / Pan-India', value: 'All' },
                    { label: 'Karnataka', value: 'Karnataka' },
                    { label: 'Maharashtra', value: 'Maharashtra' },
                    { label: 'Delhi', value: 'Delhi' }
                  ]}
                />
              </div>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Evaluating Eligibility...' : 'Find Matching Schemes'}
              </Button>
            </form>

            {/* Results Display */}
            {eligibleSchemes !== null && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Matching Benefits ({eligibleSchemes.length})
                </h2>

                {eligibleSchemes.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800">
                      No matching schemes found for the given criteria. Try adjusting your income or location parameters.
                    </p>
                  </div>
                ) : (
                  eligibleSchemes.map((scheme) => (
                    <div key={scheme.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded font-semibold mb-2">
                          {scheme.category || 'General'}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">{scheme.name}</h3>
                        <p className="text-gray-600 mt-1 text-sm">{scheme.benefits}</p>
                      </div>
                      <Button onClick={() => navigate(`/app/schemes/${scheme.id}`)}>
                        View Details & Apply
                      </Button>
                    </div>
                  ))
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