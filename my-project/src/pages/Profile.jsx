import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Navbar, Sidebar, Input, Select } from '../components';
import { Sparkles } from 'lucide-react';
import './Dashboard.css';

const buildFormData = (profile = {}) => ({
  age: profile.age ?? '',
  gender: profile.gender ?? '',
  state: profile.state ?? '',
  district: profile.district ?? '',
  urban: profile.urban ?? '',
  socialCategory: profile.socialCategory ?? '',
  disability: profile.disability ?? '',
  income: profile.income ?? '',
  bpl: profile.bpl ?? '',
  occupation: profile.occupation ?? '',
  studying: profile.studying ?? '',
  lookingForWork: profile.lookingForWork ?? '',
  ownLand: profile.ownLand ?? '',
  landholding: profile.landholding ?? '',
  ownHouse: profile.ownHouse ?? '',
  housingCondition: profile.housingCondition ?? '',
  businessPlanning: profile.businessPlanning ?? '',
  existingBusiness: profile.existingBusiness ?? '',
  businessCategory: profile.businessCategory ?? ''
});

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(buildFormData(profile));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(buildFormData(profile));
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        age: formData.age === '' ? '' : Number(formData.age),
        income: formData.income === '' ? '' : Number(formData.income),
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
    <div className="dashboard-page-canvas flex min-h-screen w-full font-dashboard selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Profile & Settings" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="dashboard-greeting mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#177e4f]/15 text-[#061b0d] text-xs font-bold uppercase tracking-wider border border-[#177e4f]/25 mb-3">
                <Sparkles size={14} className="text-[#177e4f]" />
                <span>Parameters</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                Account & Settings
              </h1>
            </div>

            <div className="rounded-[2rem] border border-[#a8d2b5] bg-white/55 p-6 sm:p-8 mb-6 shadow-sm shadow-[#177e4f]/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-bold text-[#061b0d]">Personal Record</h2>
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
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Full Name" value={user?.name || ''} disabled />
                    <Input label="Email Address" type="email" value={user?.email || ''} disabled />
                    <Input label="Phone Number" value={user?.phone || ''} disabled />
                    <Input label="Age" type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} />
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select label="Gender" value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} placeholder="Select" options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }]} />
                    <Select label="State" value={formData.state} onChange={(e) => handleChange('state', e.target.value)} placeholder="Select state" options={[{ label: 'Karnataka', value: 'Karnataka' }, { label: 'Maharashtra', value: 'Maharashtra' }, { label: 'Delhi', value: 'Delhi' }, { label: 'Tamil Nadu', value: 'Tamil Nadu' }, { label: 'West Bengal', value: 'West Bengal' }]} />
                    <Input label="District" value={formData.district} onChange={(e) => handleChange('district', e.target.value)} placeholder="District" />
                    <Select label="Urban / Rural" value={formData.urban} onChange={(e) => handleChange('urban', e.target.value)} placeholder="Select" options={[{ label: 'Urban', value: 'Urban' }, { label: 'Rural', value: 'Rural' }]} />
                    <Select label="Social Category" value={formData.socialCategory} onChange={(e) => handleChange('socialCategory', e.target.value)} placeholder="Select" options={[{ label: 'General', value: 'General' }, { label: 'OBC', value: 'OBC' }, { label: 'SC', value: 'SC' }, { label: 'ST', value: 'ST' }]} />
                    <Select label="Disability" value={formData.disability} onChange={(e) => handleChange('disability', e.target.value)} placeholder="Select" options={[{ label: 'No', value: 'No' }, { label: 'Yes', value: 'Yes' }]} />
                    <Input label="Annual Income (₹)" type="number" value={formData.income} onChange={(e) => handleChange('income', e.target.value)} placeholder="500000" />
                    <Select label="Below Poverty Line" value={formData.bpl} onChange={(e) => handleChange('bpl', e.target.value)} placeholder="Select" options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                    <Select label="Occupation" value={formData.occupation} onChange={(e) => handleChange('occupation', e.target.value)} placeholder="Select" options={[{ label: 'Farmer', value: 'Farmer' }, { label: 'Student', value: 'Student' }, { label: 'Self-Employed', value: 'Self-Employed' }, { label: 'Salaried', value: 'Salaried' }, { label: 'Unemployed', value: 'Unemployed' }, { label: 'Household', value: 'Household' }]} />
                    <Select label="Currently Studying" value={formData.studying} onChange={(e) => handleChange('studying', e.target.value)} placeholder="Select" options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                    <Select label="Looking for Work" value={formData.lookingForWork} onChange={(e) => handleChange('lookingForWork', e.target.value)} placeholder="Select" options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                    <Select label="Own Land" value={formData.ownLand} onChange={(e) => handleChange('ownLand', e.target.value)} placeholder="Select" options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                    <Input label="Landholding Size (acres)" type="number" value={formData.landholding} onChange={(e) => handleChange('landholding', e.target.value)} placeholder="0.5" />
                    <Select label="Own House" value={formData.ownHouse} onChange={(e) => handleChange('ownHouse', e.target.value)} placeholder="Select" options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                    <Select label="Housing Condition" value={formData.housingCondition} onChange={(e) => handleChange('housingCondition', e.target.value)} placeholder="Select" options={[{ label: 'Kuccha', value: 'Kuccha' }, { label: 'Semi-Pucca', value: 'Semi-Pucca' }, { label: 'Pucca', value: 'Pucca' }]} />
                    <Select label="Business Planning" value={formData.businessPlanning} onChange={(e) => handleChange('businessPlanning', e.target.value)} placeholder="Select" options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                    <Select label="Existing Business" value={formData.existingBusiness} onChange={(e) => handleChange('existingBusiness', e.target.value)} placeholder="Select" options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                    <Input label="Business Category" value={formData.businessCategory} onChange={(e) => handleChange('businessCategory', e.target.value)} placeholder="Retail, agriculture..." />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-5 py-2 rounded-full bg-[#177e4f] text-white text-xs hover:bg-[#14341e] transition shadow-sm"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
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
                    <p className="text-sm font-normal text-[#14341e] mt-1">{user?.name || 'Citizen'}</p>
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

            <div className="rounded-[2rem] border border-[#a8d2b5] bg-white/55 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm shadow-[#177e4f]/5">
              <p className="text-xs text-[#0a2e14]/75 font-medium">
                Session state is isolated locally. Revoking credentials clears browser storage.
              </p>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-[#061b0d] hover:bg-[#177e4f] text-[#c9f3ce] hover:text-white text-xs font-bold uppercase tracking-wider transition"
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