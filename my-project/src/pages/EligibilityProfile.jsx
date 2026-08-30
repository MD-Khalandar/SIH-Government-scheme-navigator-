import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { Input, Select } from '../components';

export const EligibilityProfile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    state: '',
    district: '',
    urban: '',
    socialCategory: '',
    disability: '',
    income: '',
    bpl: '',
    occupation: '',
    studying: '',
    lookingForWork: '',
    ownLand: '',
    landholding: '',
    dependents: '',
    children: '',
    seniorCitizens: '',
    ownHouse: '',
    housingCondition: ''
  });

  useEffect(() => {
    if (!profile) return;
    setFormData(prev => ({
      ...prev,
      age: profile.age ?? prev.age,
      gender: profile.gender ?? prev.gender,
      state: profile.state ?? prev.state,
      urban: profile.urban ?? prev.urban,
      dependents: profile.dependents ?? prev.dependents,
      children: profile.children ?? prev.children,
      district: profile.district ?? prev.district,
      socialCategory: profile.socialCategory ?? prev.socialCategory,
      disability: profile.disability ?? prev.disability,
      income: profile.income ?? prev.income,
      occupation: profile.occupation ?? prev.occupation,
      ownLand: profile.ownLand ?? prev.ownLand,
      landholding: profile.landholding ?? prev.landholding,
      seniorCitizens: profile.seniorCitizens ?? prev.seniorCitizens,
      ownHouse: profile.ownHouse ?? prev.ownHouse,
      housingCondition: profile.housingCondition ?? prev.housingCondition
    }));
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        age: formData.age ? Number(formData.age) : null,
        income: {
          'below-1L': 99999,
          '1L-2.5L': 250000,
          '2.5L-5L': 500000,
          '5L-10L': 1000000,
          'above-10L': 1000001
        }[formData.income] ?? null
      });
      navigate('/app/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e] px-6 sm:px-12 lg:px-20 xl:px-28 py-12">
      <div className="w-full">
        <div className="mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Demographics</span>
          <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">Eligibility Criteria Profile</h1>
          <p className="text-sm sm:text-base text-[#14341e]/70 font-light mt-1">
            Data provided is evaluated on-device to match statutory rules without storing unneeded personal attributes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-normal text-[#14341e]">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Years" />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                  { label: 'Prefer not to say', value: 'prefer-not' }
                ]}
                placeholder="Select gender"
              />
              <Select
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                options={[
                  { label: 'Karnataka', value: 'karnataka' },
                  { label: 'Maharashtra', value: 'maharashtra' },
                  { label: 'Delhi', value: 'delhi' },
                  { label: 'Tamil Nadu', value: 'tamil-nadu' }
                ]}
                placeholder="Select residence state"
              />
              <Select
                label="Region Classification"
                name="urban"
                value={formData.urban}
                onChange={handleChange}
                options={[
                  { label: 'Urban', value: 'urban' },
                  { label: 'Rural', value: 'rural' }
                ]}
                placeholder="Select settlement type"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-normal text-[#14341e]">Category & Economic Status</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Category"
                name="socialCategory"
                value={formData.socialCategory}
                onChange={handleChange}
                options={[
                  { label: 'General', value: 'general' },
                  { label: 'OBC', value: 'obc' },
                  { label: 'SC', value: 'sc' },
                  { label: 'ST', value: 'st' },
                  { label: 'Prefer not to say', value: 'prefer-not' }
                ]}
                placeholder="Select category"
              />
              <Select
                label="Household Annual Income"
                name="income"
                value={formData.income}
                onChange={handleChange}
                options={[
                  { label: 'Below 1 Lakh', value: 'below-1L' },
                  { label: '1 - 2.5 Lakh', value: '1L-2.5L' },
                  { label: '2.5 - 5 Lakh', value: '2.5L-5L' },
                  { label: '5 - 10 Lakh', value: '5L-10L' },
                  { label: 'Above 10 Lakh', value: 'above-10L' }
                ]}
                placeholder="Select income bracket"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-normal text-[#14341e]">Occupation & Dependents</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Select
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                options={[
                  { label: 'Student', value: 'student' },
                  { label: 'Farmer', value: 'farmer' },
                  { label: 'Salaried', value: 'salaried' },
                  { label: 'Self-employed', value: 'self-employed' },
                  { label: 'Unemployed', value: 'unemployed' },
                  { label: 'Homemaker', value: 'homemaker' }
                ]}
                placeholder="Select work status"
              />
              <Input label="Dependents" type="number" name="dependents" value={formData.dependents} onChange={handleChange} placeholder="0" />
              <Input label="Children" type="number" name="children" value={formData.children} onChange={handleChange} placeholder="0" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/app/life-events')}
              className="px-6 py-2.5 rounded-full bg-white/60 hover:bg-white text-xs font-light text-[#14341e] border border-[#a9c7b1]/50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2.5 rounded-full bg-[#177e4f] text-white text-xs font-normal hover:bg-[#14341e] transition shadow-sm"
            >
              {loading ? 'Evaluating...' : 'Find My Benefits'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EligibilityProfile;