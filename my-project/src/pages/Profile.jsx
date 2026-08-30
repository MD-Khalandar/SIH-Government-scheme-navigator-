import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Navbar, Sidebar, Input, Select } from '../components';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer-not' }
];

const stateOptions = [
  { label: 'Karnataka', value: 'karnataka' },
  { label: 'Maharashtra', value: 'maharashtra' },
  { label: 'Delhi', value: 'delhi' },
  { label: 'Tamil Nadu', value: 'tamil-nadu' },
  { label: 'West Bengal', value: 'west-bengal' },
  { label: 'Andhra Pradesh', value: 'andhra-pradesh' }
];

const urbanOptions = [
  { label: 'Urban', value: 'urban' },
  { label: 'Rural', value: 'rural' }
];

const occupationOptions = [
  { label: 'Student', value: 'student' },
  { label: 'Farmer', value: 'farmer' },
  { label: 'Salaried', value: 'salaried' },
  { label: 'Self-employed', value: 'self-employed' },
  { label: 'Unemployed', value: 'unemployed' },
  { label: 'Homemaker', value: 'homemaker' }
];

const categoryOptions = [
  { label: 'General', value: 'general' },
  { label: 'OBC', value: 'obc' },
  { label: 'SC', value: 'sc' },
  { label: 'ST', value: 'st' },
  { label: 'Prefer not to say', value: 'prefer-not' }
];

const incomeOptions = [
  { label: 'Below 1 Lakh', value: 'below-1L' },
  { label: '1 - 2.5 Lakh', value: '1L-2.5L' },
  { label: '2.5 - 5 Lakh', value: '2.5L-5L' },
  { label: '5 - 10 Lakh', value: '5L-10L' },
  { label: 'Above 10 Lakh', value: 'above-10L' }
];

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
];

const buildInitialFormData = (user, profile) => ({
  fullName: profile?.name || user?.name || '',
  age: profile?.age ?? '',
  gender: profile?.gender ?? '',
  state: profile?.state ?? '',
  district: profile?.district ?? '',
  urban: profile?.urban ?? '',
  socialCategory: profile?.socialCategory ?? '',
  income: profile?.income ?? '',
  occupation: profile?.occupation ?? '',
  dependents: profile?.dependents ?? '',
  children: profile?.children ?? '',
  ownLand: profile?.ownLand ?? '',
  landholding: profile?.landholding ?? '',
  disability: profile?.disability ?? '',
  lookingForWork: profile?.lookingForWork ?? ''
});

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(buildInitialFormData(user, profile));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(buildInitialFormData(user, profile));
  }, [user, profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...profile,
        ...formData,
        name: formData.fullName,
        age: formData.age ? Number(formData.age) : null,
        dependents: formData.dependents ? Number(formData.dependents) : 0,
        children: formData.children ? Number(formData.children) : 0,
        landholding: formData.landholding ? Number(formData.landholding) : null
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Profile & Settings" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Parameters</span>
              <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">Account & Settings</h1>
            </div>

            <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-normal text-[#14341e]">Personal Record</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1 rounded-full bg-white/60 hover:bg-white text-xs text-[#14341e] border border-[#a9c7b1]/40 transition"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                    <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={genderOptions} placeholder="Select gender" />
                    <Select label="State" name="state" value={formData.state} onChange={handleChange} options={stateOptions} placeholder="Select state" />
                    <Input label="District" name="district" value={formData.district} onChange={handleChange} placeholder="District" />
                    <Select label="Area Type" name="urban" value={formData.urban} onChange={handleChange} options={urbanOptions} placeholder="Select area type" />
                    <Select label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} options={occupationOptions} placeholder="Select occupation" />
                    <Select label="Social Category" name="socialCategory" value={formData.socialCategory} onChange={handleChange} options={categoryOptions} placeholder="Select category" />
                    <Select label="Income" name="income" value={formData.income} onChange={handleChange} options={incomeOptions} placeholder="Select income" />
                    <Input label="Dependents" type="number" name="dependents" value={formData.dependents} onChange={handleChange} placeholder="0" />
                    <Input label="Children" type="number" name="children" value={formData.children} onChange={handleChange} placeholder="0" />
                    <Select label="Own Land" name="ownLand" value={formData.ownLand} onChange={handleChange} options={yesNoOptions} placeholder="Select option" />
                    <Input label="Landholding" type="number" step="0.1" name="landholding" value={formData.landholding} onChange={handleChange} placeholder="Acres" />
                    <Select label="Disability" name="disability" value={formData.disability} onChange={handleChange} options={yesNoOptions} placeholder="Select option" />
                    <Select label="Looking For Work" name="lookingForWork" value={formData.lookingForWork} onChange={handleChange} options={yesNoOptions} placeholder="Select option" />
                  </div>
                  <div className="rounded-2xl bg-white/50 border border-[#a9c7b1]/30 p-4 text-xs text-[#14341e]/70">
                    <p>Email and phone number remain locked for account security.</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-5 py-2 rounded-full bg-[#177e4f] text-white text-xs hover:bg-[#14341e] transition shadow-sm"
                    >
                      {loading ? 'Saving...' : 'Commit Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2 rounded-full bg-white/60 text-xs text-[#14341e] border border-[#a9c7b1]/40 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-light">
                  <div>
                    <p className="text-[#14341e]/50">Full Name</p>
                    <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.name || user?.name || 'Citizen'}</p>
                  </div>
                  <div>
                    <p className="text-[#14341e]/50">Email Address</p>
                    <p className="text-sm font-normal text-[#14341e] mt-1">{user?.email || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-[#14341e]/50">Registered Line</p>
                    <p className="text-sm font-normal text-[#14341e] mt-1">{user?.phone || 'None'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 mb-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-normal text-[#14341e] mb-5">Active Criteria Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-light mb-6">
                <div>
                  <p className="text-[#14341e]/50">Age</p>
                  <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.age || 'Not defined'}</p>
                </div>
                <div>
                  <p className="text-[#14341e]/50">Territory</p>
                  <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.state || 'Not defined'}</p>
                </div>
                <div>
                  <p className="text-[#14341e]/50">Income</p>
                  <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.income || 'Not defined'}</p>
                </div>
                <div>
                  <p className="text-[#14341e]/50">Occupation</p>
                  <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.occupation || 'Not defined'}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/app/eligibility-profile')}
                className="px-5 py-2 rounded-full bg-white/60 hover:bg-white text-xs text-[#14341e] border border-[#a9c7b1]/40 transition"
              >
                Re-evaluate Profile Criteria
              </button>
            </div>

            <div className="rounded-3xl bg-white/30 backdrop-blur-sm border border-[#a9c7b1]/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-[#14341e]/70 font-light">
                Session state is isolated locally. Revoking credentials clears browser storage.
              </p>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-rose-700/80 hover:bg-rose-800 text-white text-xs font-light transition"
              >
                Terminate Session
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;