import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { Stepper, Button } from '../components';

const onboardingSteps = [
  { id: 1, title: 'Context' },
  { id: 2, title: 'Jurisdiction' },
  { id: 3, title: 'Household' },
  { id: 4, title: 'Protocols' }
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(profile?.onboardingStep || 1);
  const [formData, setFormData] = useState({
    age: profile?.age ?? '',
    gender: profile?.gender ?? '',
    state: profile?.state ?? '',
    urban: profile?.urban ?? '',
    dependents: profile?.dependents ?? '',
    children: profile?.children ?? ''
  });

  const updateField = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleNext = async () => {
    try {
      await updateProfile({
        ...formData,
        age: formData.age ? Number(formData.age) : null,
        onboardingStep: currentStep + 1
      });

      if (currentStep < onboardingSteps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        navigate('/app/life-events');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e] px-6 sm:px-12 lg:px-20 xl:px-28 py-12">
      <div className="w-full">
        <div className="mb-10">
          <Stepper steps={onboardingSteps} currentStep={currentStep} />
        </div>

        <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-10 mb-6 shadow-sm">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Stage {currentStep} of 4</span>
            <h1 className="text-2xl sm:text-3xl font-light text-[#14341e] tracking-tight mt-1">
              {onboardingSteps[currentStep - 1].title}
            </h1>
            <p className="text-xs sm:text-sm text-[#14341e]/60 font-light mt-1">
              Data points are applied strictly for algorithmic ruleset cross-checks.
            </p>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-light text-[#14341e]/80 mb-1.5">Applicant Age</label>
                <input
                  type="number"
                  name="age"
                  min="1"
                  max="120"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={updateField}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={updateField}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={updateField}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                >
                  <option value="">Select your state</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="delhi">Delhi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urban or Rural?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="urban" value="urban" checked={formData.urban === 'urban'} onChange={updateField} />
                    <span>Urban</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="urban" value="rural" checked={formData.urban === 'rural'} onChange={updateField} />
                    <span>Rural</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-light text-[#14341e]/80 mb-1.5">Dependent Family Members</label>
                <input
                  type="number"
                  name="dependents"
                  min="0"
                  placeholder="0"
                  value={formData.dependents}
                  onChange={updateField}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-light text-[#14341e]/80 mb-1.5">Children in School / College</label>
                <input
                  type="number"
                  name="children"
                  min="0"
                  placeholder="0"
                  value={formData.children}
                  onChange={updateField}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4 max-w-xl">
              <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 text-xs text-amber-900 font-light space-y-2">
                <p className="font-normal">Statutory Security Safeguard:</p>
                <ul className="list-disc ml-5 space-y-1 text-[11px]">
                  <li>Never submit national identity digits (such as Aadhaar or universal IDs)</li>
                  <li>Never input bank secret codes, transaction pins, or one-time keys</li>
                </ul>
              </div>
              <p className="text-xs text-[#14341e]/70 font-light">
                Certificates and records are inspected on eligibility confirmation workflows.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-[#14341e]/10">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-5 py-2 rounded-full bg-white/60 hover:bg-white disabled:opacity-30 text-xs font-light text-[#14341e] border border-[#a9c7b1]/50 transition"
            >
              Previous
            </button>
            <Button onClick={handleNext} type="button" className="px-6 py-2 rounded-full bg-[#177e4f] text-white text-xs font-normal hover:bg-[#14341e] transition shadow-sm">
              {currentStep === onboardingSteps.length ? 'Finalize Profiles' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;