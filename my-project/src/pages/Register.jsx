import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import securePasswordIllustration from '../assets/undraw_secure-password_9qv4.svg';
import './Register.css';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) newErrors.terms = 'Please accept the consent declaration to continue';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/app/onboarding');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-canvas min-h-screen w-full text-[#061b0d] font-register flex flex-col justify-between selection:bg-[#2fe066] selection:text-[#061b0d] overflow-x-hidden antialiased">
      
      {/* Top Header Row without Support */}
      <header className="w-full px-6 sm:px-12 lg:px-20 py-5 flex items-center justify-between z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#061b0d] to-[#177e4f] flex items-center justify-center text-[#c9f3ce] font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform duration-300">
            S
          </div>
          <span className="font-extrabold tracking-tight text-xl text-[#061b0d]">
            SAHAYAK
          </span>
        </Link>

        <div className="flex items-center text-sm font-semibold">
          <span className="text-[#0a2e14]">
            Already enrolled?{' '}
            <Link to="/login" className="text-[#177e4f] font-bold hover:underline ml-1">
              Sign In
            </Link>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-6 sm:py-10 z-10">
        <div className="lucid-glass-card w-full max-w-5xl rounded-[2.5rem] p-8 sm:p-12 lg:p-14 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual & Benefits Showcase */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between h-full border-r border-[#061b0d]/15 pr-10">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#177e4f]/20 text-[#061b0d] text-xs font-bold uppercase tracking-wider border border-[#177e4f]/30">
                <Sparkles size={14} className="text-[#177e4f]" />
                Instant Eligibility Matching
              </span>
              <h2 className="text-3xl font-extrabold text-[#061b0d] tracking-tight leading-tight">
                Unlock every scheme you are entitled to.
              </h2>
              <p className="text-sm font-medium text-[#0a2e14] leading-relaxed">
                Create an anonymous profile once to receive verified grants, subsidies, and application roadmaps automatically.
              </p>
            </div>

            {/* Graphic Illustration Card */}
            <div className="relative my-8 rounded-2xl overflow-hidden border border-white/90 shadow-md bg-gradient-to-br from-[#177e4f]/25 via-white/50 to-[#c9f3ce]/70 p-5">
              <img
                src={securePasswordIllustration}
                alt="Secure password illustration"
                className="w-full h-40 object-contain object-bottom opacity-95 rounded-xl mb-4"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#061b0d]">
                  <CheckCircle2 size={16} className="text-[#177e4f]" />
                  <span>On-Device Criteria Processing</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#061b0d]">
                  <CheckCircle2 size={16} className="text-[#177e4f]" />
                  <span>Direct Nodal Portal Redirection</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#061b0d]">
                  <CheckCircle2 size={16} className="text-[#177e4f]" />
                  <span>No Intermediaries or Agent Commissions</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#061b0d]">
              <ShieldCheck size={16} className="text-[#177e4f]" />
              <span>Smart India Hackathon 2026 Initiative</span>
            </div>
          </div>

          {/* Right Column: Register Form */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                Create Account
              </h1>
              <p className="text-sm font-medium text-[#0a2e14] mt-2">
                Begin your unified citizen welfare profile
              </p>
            </div>

            {errors.submit && (
              <div className="bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold px-4 py-3 rounded-2xl mb-6 shadow-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Legal Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="lucid-input-field w-full px-4 py-3 text-sm font-bold rounded-xl outline-none"
                />
                {errors.fullName && (
                  <p className="text-xs font-bold text-rose-800 ml-1 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="lucid-input-field w-full px-4 py-3 text-sm font-bold rounded-xl outline-none"
                />
                {errors.email && (
                  <p className="text-xs font-bold text-rose-800 ml-1 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create Password (min. 6 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  className="lucid-input-field w-full px-4 py-3 text-sm font-bold rounded-xl outline-none pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0a2e14] hover:text-[#061b0d] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && (
                  <p className="text-xs font-bold text-rose-800 ml-1 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="lucid-input-field w-full px-4 py-3 text-sm font-bold rounded-xl outline-none pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0a2e14] hover:text-[#061b0d] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-xs font-bold text-rose-800 ml-1 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-[#061b0d] leading-snug">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#177e4f] border-[#061b0d]/30 focus:ring-[#177e4f] flex-shrink-0"
                  />
                  <span>
                    I consent to anonymous algorithmic matching against government rulesets under the{' '}
                    <Link to="#" className="text-[#177e4f] hover:text-[#061b0d] hover:underline font-bold">
                      Citizen Terms
                    </Link>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs font-bold text-rose-800 ml-1 mt-1">{errors.terms}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#061b0d] hover:bg-[#177e4f] text-[#c9f3ce] hover:text-white text-sm font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Profile...' : 'Create Free Account'}</span>
                {!loading && <ArrowRight size={16} className="text-[#4ae278]" />}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer Legal Statement */}
      <footer className="w-full px-6 py-4 text-center text-xs font-bold text-[#0a2e14] z-10">
        Sahayak is protected by zero-tracking protocols and standard{' '}
        <Link to="#" className="text-[#177e4f] hover:underline font-bold">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="#" className="text-[#177e4f] hover:underline font-bold">
          Privacy Statement
        </Link>
        .
      </footer>
    </div>
  );
};

export default Register;
