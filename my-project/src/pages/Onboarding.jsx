import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  User, 
  MapPin, 
  Users, 
  FileCheck2, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import onlineSurveyIllustration from '../assets/undraw_online-survey_xq2g.svg';
import './Onboarding.css';

const steps = [
  { id: 1, title: 'Context', label: 'About You', icon: User },
  { id: 2, title: 'Jurisdiction', label: 'State', icon: MapPin },
  { id: 3, title: 'Household', label: 'Family', icon: Users },
  { id: 4, title: 'Protocols', label: 'Safeguard', icon: FileCheck2 }
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(profile?.onboardingStep || 1);
  
  const [formData, setFormData] = useState({
    age: profile?.age ?? '',
    gender: profile?.gender ?? '',
    state: profile?.state ?? '',
    urban: profile?.urban ?? 'urban',
    dependents: profile?.dependents ?? '',
    children: profile?.children ?? ''
  });

  const [error, setError] = useState('');

  const updateField = (name, value) => {
    setError('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (currentStep === 1 && (!formData.age || !formData.gender)) {
      setError('Please provide age and gender.');
      return;
    }
    if (currentStep === 2 && !formData.state) {
      setError('Please select a state of residence.');
      return;
    }

    try {
      await updateProfile({
        ...formData,
        age: formData.age ? Number(formData.age) : null,
        onboardingStep: currentStep + 1
      });

      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        navigate('/app/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Could not update profile information. Please retry.');
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="onboarding-page-canvas min-h-screen w-full text-[#061b0d] font-onboarding flex flex-col justify-between selection:bg-[#2fe066] selection:text-[#061b0d] overflow-x-hidden antialiased relative">
      
      {/* Top Header Bar */}
      <header className="w-full px-6 sm:px-12 lg:px-20 py-5 flex items-center justify-between z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#061b0d] to-[#177e4f] flex items-center justify-center text-[#c9f3ce] font-extrabold text-sm shadow-xs group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-extrabold tracking-tight text-lg text-[#061b0d]">
            SAHAYAK
          </span>
        </Link>

        {/* Minimal Dashboard Link */}
        <Link 
          to="/app/dashboard" 
          className="text-s font-semibold text-[#0a2e14]/75 hover:text-[#177e4f] transition-colors inline-flex items-center gap-1"
        >
          <span>Skip to Dashboard</span>
          <ArrowRight size={13} />
        </Link>
      </header>

      {/* Center Setup Card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 z-10">
        <div className="onboarding-glass-card w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col justify-between">
          
          <div className="p-8 sm:p-12">
            {/* Minimal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#177e4f]/15 text-[#177e4f] flex items-center justify-center flex-shrink-0">
                {React.createElement(steps[currentStep - 1].icon, { size: 18, strokeWidth: 2 })}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#177e4f] block">
                  0{currentStep} / 0{steps.length} &bull; {steps[currentStep - 1].title}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#061b0d] tracking-tight">
                  {currentStep === 1 && "What's your age & gender?"}
                  {currentStep === 2 && "Where is your residence?"}
                  {currentStep === 3 && "Tell us about your household."}
                  {currentStep === 4 && "Public Privacy Standard"}
                </h1>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium px-3.5 py-2 rounded-lg mb-5 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Step Form Body */}
            <div key={currentStep} className="onboarding-step-enter space-y-6">
              
              {/* STEP 1: Context */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <p className="text-xs font-medium text-[#0a2e14]/80">
                    Determines baseline eligibility across educational, maternity, and social assistance schemes.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#0a2e14]/75">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="e.g. 24"
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      className="onboarding-underline-input w-full py-1.5 text-lg"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#0a2e14]/75 block">
                      Gender
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {['male', 'female', 'other'].map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => updateField('gender', g)}
                          className={`onboarding-choice-pill px-5 py-2 rounded-full text-xs font-semibold capitalize ${
                            formData.gender === g ? 'active' : ''
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Jurisdiction */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <p className="text-xs font-medium text-[#0a2e14]/80">
                    State and rural mandates evaluate eligibility rules separately.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#0a2e14]/75 block">
                      State / Union Territory
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="onboarding-select-input w-full px-3.5 py-2.5 rounded-lg text-xs"
                    >
                      <option value="">Select state</option>
                      <optgroup label="States">
                        <option value="andhra-pradesh">Andhra Pradesh</option>
                        <option value="arunachal-pradesh">Arunachal Pradesh</option>
                        <option value="assam">Assam</option>
                        <option value="bihar">Bihar</option>
                        <option value="chhattisgarh">Chhattisgarh</option>
                        <option value="goa">Goa</option>
                        <option value="gujarat">Gujarat</option>
                        <option value="haryana">Haryana</option>
                        <option value="himachal-pradesh">Himachal Pradesh</option>
                        <option value="jharkhand">Jharkhand</option>
                        <option value="karnataka">Karnataka</option>
                        <option value="kerala">Kerala</option>
                        <option value="madhya-pradesh">Madhya Pradesh</option>
                        <option value="maharashtra">Maharashtra</option>
                        <option value="manipur">Manipur</option>
                        <option value="meghalaya">Meghalaya</option>
                        <option value="mizoram">Mizoram</option>
                        <option value="nagaland">Nagaland</option>
                        <option value="odisha">Odisha</option>
                        <option value="punjab">Punjab</option>
                        <option value="rajasthan">Rajasthan</option>
                        <option value="sikkim">Sikkim</option>
                        <option value="tamil-nadu">Tamil Nadu</option>
                        <option value="telangana">Telangana</option>
                        <option value="tripura">Tripura</option>
                        <option value="uttar-pradesh">Uttar Pradesh</option>
                        <option value="uttarakhand">Uttarakhand</option>
                        <option value="west-bengal">West Bengal</option>
                      </optgroup>
                      <optgroup label="Union Territories">
                        <option value="andaman-and-nicobar-islands">Andaman and Nicobar Islands</option>
                        <option value="chandigarh">Chandigarh</option>
                        <option value="dadra-and-nagar-haveli-and-daman-and-diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="delhi">Delhi</option>
                        <option value="jammu-and-kashmir">Jammu and Kashmir</option>
                        <option value="ladakh">Ladakh</option>
                        <option value="lakshadweep">Lakshadweep</option>
                        <option value="puducherry">Puducherry</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#0a2e14]/75 block">
                      Settlement
                    </label>
                    <div className="flex gap-3">
                      {[
                        { val: 'urban', label: 'Urban' },
                        { val: 'rural', label: 'Rural' }
                      ].map((area) => (
                        <button
                          type="button"
                          key={area.val}
                          onClick={() => updateField('urban', area.val)}
                          className={`onboarding-choice-pill flex-1 py-2 rounded-lg text-xs font-semibold ${
                            formData.urban === area.val ? 'active' : ''
                          }`}
                        >
                          {area.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Household */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <p className="text-xs font-medium text-[#0a2e14]/80">
                    Aids in matching household healthcare and family allowances.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#0a2e14]/75 block">
                        Dependents
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.dependents}
                        onChange={(e) => updateField('dependents', e.target.value)}
                        className="onboarding-underline-input w-full py-1.5 text-lg"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#0a2e14]/75 block">
                        Children in School
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.children}
                        onChange={(e) => updateField('children', e.target.value)}
                        className="onboarding-underline-input w-full py-1.5 text-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Protocols */}
              {currentStep === 4 && (
                <div className="space-y-3.5">
                  <div className="rounded-xl bg-white/80 border border-[#177e4f]/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#177e4f]">
                      <ShieldCheck size={16} />
                      <span>Zero-Identity Protocol</span>
                    </div>
                    <ul className="list-disc ml-4 space-y-1 text-xs font-medium text-[#0a2e14]/85">
                      <li>Never enter government identification digits.</li>
                      <li>Never share banking credentials or one-time verification keys.</li>
                      <li>Matching logic operates client-side prior to redirection.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary-mild px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary-mild px-6 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{currentStep === steps.length ? 'Finish & Open Dashboard' : 'Continue'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Minimal Bottom Stepper Track */}
          <div className="onboarding-stepper-track px-6 py-3 flex items-center justify-between gap-2">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (step.id <= currentStep) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`stepper-btn flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg ${
                    isActive ? 'active' : isCompleted ? 'completed' : 'idle'
                  }`}
                >
                  <StepIcon size={13} strokeWidth={2} />
                  <span className="text-[11px] font-semibold hidden sm:inline truncate">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom-Right Background Illustration */}
      <div className="fixed bottom-0 right-0 pointer-events-none z-0 hidden md:block max-w-[280px] lg:max-w-[340px] opacity-70 select-none">
        <img
          src={onlineSurveyIllustration}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain object-bottom"
        />
      </div>

      {/* Footer */}
      <footer className="w-full px-6 py-3 text-center text-[11px] font-medium text-[#0a2e14]/60 z-10">
        Sahayak Welfare Engine &bull; Smart India Hackathon 2026
      </footer>
    </div>
  );
};

export default Onboarding;
