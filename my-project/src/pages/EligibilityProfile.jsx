import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { Button, Input, Select, Card } from '../components';

export const EligibilityProfile = () => {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      navigate('/app/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Eligibility Profile</h1>
          <p className="text-lg text-gray-600">
            We only ask for information needed to find relevant schemes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
              />
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
                placeholder="Select your state"
              />
              <Select
                label="Urban or Rural"
                name="urban"
                value={formData.urban}
                onChange={handleChange}
                options={[
                  { label: 'Urban', value: 'urban' },
                  { label: 'Rural', value: 'rural' }
                ]}
                placeholder="Select area type"
              />
            </div>
          </Card>

          {/* Social Category */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Social Category</h2>
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
          </Card>

          {/* Financial Information */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Household Annual Income"
                name="income"
                value={formData.income}
                onChange={handleChange}
                options={[
                  { label: 'Below ₹1 lakh', value: 'below-1L' },
                  { label: '₹1–2.5 lakh', value: '1L-2.5L' },
                  { label: '₹2.5–5 lakh', value: '2.5L-5L' },
                  { label: '₹5–10 lakh', value: '5L-10L' },
                  { label: 'Above ₹10 lakh', value: 'above-10L' }
                ]}
                placeholder="Select income range"
              />
              <Select
                label="BPL Status"
                name="bpl"
                value={formData.bpl}
                onChange={handleChange}
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                  { label: 'Not sure', value: 'not-sure' }
                ]}
                placeholder="BPL / Priority household?"
              />
            </div>
          </Card>

          {/* Employment */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Employment</h2>
            <div className="grid md:grid-cols-2 gap-4">
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
                  { label: 'Homemaker', value: 'homemaker' },
                  { label: 'Other', value: 'other' }
                ]}
                placeholder="Select occupation"
              />
              <Select
                label="Currently Looking for Work?"
                name="lookingForWork"
                value={formData.lookingForWork}
                onChange={handleChange}
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' }
                ]}
                placeholder="Looking for work?"
              />
            </div>
          </Card>

          {/* Family */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Family Information</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Number of Dependents"
                type="number"
                name="dependents"
                value={formData.dependents}
                onChange={handleChange}
                placeholder="0"
              />
              <Input
                label="Number of Children"
                type="number"
                name="children"
                value={formData.children}
                onChange={handleChange}
                placeholder="0"
              />
              <Input
                label="Senior Citizens (60+)"
                type="number"
                name="seniorCitizens"
                value={formData.seniorCitizens}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </Card>

          {/* Housing */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Housing</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Own a House?"
                name="ownHouse"
                value={formData.ownHouse}
                onChange={handleChange}
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' }
                ]}
                placeholder="Own a house?"
              />
              <Select
                label="Housing Condition"
                name="housingCondition"
                value={formData.housingCondition}
                onChange={handleChange}
                options={[
                  { label: 'Pucca', value: 'pucca' },
                  { label: 'Semi-pucca', value: 'semi-pucca' },
                  { label: 'Kutcha', value: 'kutcha' }
                ]}
                placeholder="Housing condition"
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/app/life-events')}
              type="button"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
              className="ml-auto"
            >
              Find My Benefits
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EligibilityProfile;
