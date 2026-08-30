import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { Stepper, Button, Card } from '../components';

const onboardingSteps = [
  { id: 1, title: 'About You' },
  { id: 2, title: 'Your Situation' },
  { id: 3, title: 'Household' },
  { id: 4, title: 'Documents' }
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(profile?.onboardingStep || 1);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/app/life-events');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stepper */}
        <div className="mb-12">
          <Stepper steps={onboardingSteps} currentStep={currentStep} />
        </div>

        {/* Content */}
        <Card className="mb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {onboardingSteps[currentStep - 1].title}
            </h1>
            <p className="text-gray-600">
              We only ask for information needed to find relevant schemes.
            </p>
          </div>

          {/* Step 1: About You */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Enter your age"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white">
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Your Situation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white">
                  <option>Select your state</option>
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urban or Rural?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="area" defaultChecked />
                    <span>Urban</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="area" />
                    <span>Rural</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Household */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Dependents</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">Important Privacy Note</p>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Never enter:</strong>
                  <ul className="mt-2 ml-4 space-y-1 text-sm">
                    <li>• Aadhaar numbers</li>
                    <li>• Bank passwords</li>
                    <li>• OTPs or verification codes</li>
                    <li>• Other sensitive credentials</li>
                  </ul>
                </p>
              </div>
              <p className="text-gray-700">You'll mark documents as "ready" when needed for each scheme.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="ml-auto"
            >
              {currentStep === onboardingSteps.length ? 'Continue to Benefits' : 'Continue'}
            </Button>
          </div>
        </Card>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> You can update your profile anytime in the settings.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
