import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  KeyRound, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import stackedPeaks from '../assets/stacked-peaks-haikei.svg';
import authenticationIllustration from '../assets/undraw_authentication_1evl.svg';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');

  const validateForm = () => {
    const newErrors = {};
    if (!emailOrPhone) {
      newErrors.emailOrPhone = loginMethod === 'email' ? 'Email address is required' : 'Phone number is required';
    }
    if (loginMethod === 'email' && !password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (loginMethod === 'phone') {
        await authService.sendPhoneOTP(emailOrPhone);
        navigate('/verify-otp', { state: { phone: emailOrPhone, mode: 'phone-login' } });
        return;
      }

      await login(emailOrPhone, password);
      navigate('/app/dashboard');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-canvas min-h-screen w-full text-[#061b0d] font-login flex flex-col justify-between selection:bg-[#2fe066] selection:text-[#061b0d] overflow-x-hidden antialiased">
      
      {/* Top Header Row (Zoom Style) */}
      <header className="w-full px-6 sm:px-12 lg:px-20 py-5 flex items-center justify-between z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#061b0d] to-[#177e4f] flex items-center justify-center text-[#c9f3ce] font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform duration-300">
            S
          </div>
          <span className="font-extrabold tracking-tight text-xl text-[#061b0d]">
            SAHAYAK
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="hidden sm:inline text-[#061b0d]/70">
            New to Sahayak?{' '}
            <Link to="/register" className="text-[#177e4f] font-bold hover:underline ml-1">
              Sign Up Free
            </Link>
          </span>
          <Link to="/help" className="text-[#061b0d]/80 hover:text-[#177e4f] transition-colors">
            Support
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-6 sm:py-10 z-10">
        <div className="lucid-glass-card w-full max-w-5xl rounded-[2.5rem] p-8 sm:p-12 lg:p-14 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual & Verification Badges */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between h-full border-r border-[#061b0d]/10 pr-10">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#177e4f]/15 text-[#177e4f] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                Verified Citizen Portal
              </span>
              <h2 className="text-3xl font-extrabold text-[#061b0d] tracking-tight leading-tight">
                One unified key for all public benefits.
              </h2>
              <p className="text-sm font-medium text-[#061b0d]/75 leading-relaxed">
                Connect your state and central entitlements securely with zero third-party commercial data retention.
              </p>
            </div>

            {/* Graphic Card Illustration Panel */}
            <div className="relative my-8 rounded-2xl overflow-hidden border border-white/90 shadow-md bg-gradient-to-br from-[#177e4f]/20 via-white/40 to-[#c9f3ce]/60 p-5">
              <img
                src={authenticationIllustration}
                alt="Secure authentication illustration"
                className="w-full h-40 object-contain object-bottom opacity-90 rounded-xl mb-4"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#061b0d]">
                  <CheckCircle2 size={16} className="text-[#177e4f]" />
                  <span>Direct State Portal Synchronization</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#061b0d]">
                  <CheckCircle2 size={16} className="text-[#177e4f]" />
                  <span>End-to-End Encrypted Verification</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-medium text-[#061b0d]/60">
              Assisting over 2,400+ national, state, and rural assistance programs.
            </p>
          </div>

          {/* Right Column: Sign In Form (Mirrors Zoom Layout) */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                Sign In
              </h1>
              <p className="text-sm font-medium text-[#061b0d]/75 mt-2">
                Select your preferred authentication credential
              </p>
            </div>

            {errors.submit && (
              <div className="bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold px-4 py-3 rounded-2xl mb-6 shadow-sm">
                {errors.submit}
              </div>
            )}

            {/* Email / Phone Method Toggle */}
            <div className="lucid-pill-track flex rounded-full p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('email');
                  setErrors({});
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold transition-all duration-200 ${
                  loginMethod === 'email' ? 'lucid-pill-active' : 'lucid-pill-idle'
                }`}
              >
                <Mail size={15} />
                <span>Email Address</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('phone');
                  setErrors({});
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold transition-all duration-200 ${
                  loginMethod === 'phone' ? 'lucid-pill-active' : 'lucid-pill-idle'
                }`}
              >
                <Phone size={15} />
                <span>Mobile OTP</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Main Identifier Field */}
              <div>
                <input
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  placeholder={loginMethod === 'email' ? 'Email Address' : '10-Digit Mobile Number'}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="lucid-input-field w-full px-5 py-3.5 text-sm font-semibold rounded-xl outline-none placeholder-[#061b0d]/40"
                />
                {errors.emailOrPhone && (
                  <p className="text-xs font-semibold text-rose-700 ml-1 mt-1.5">{errors.emailOrPhone}</p>
                )}
              </div>

              {/* Password Field */}
              {loginMethod === 'email' && (
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="lucid-input-field w-full px-5 py-3.5 text-sm font-semibold rounded-xl outline-none placeholder-[#061b0d]/40 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#061b0d]/50 hover:text-[#061b0d] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <p className="text-xs font-semibold text-rose-700 ml-1 mt-1.5">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Help & Forgot Password Links */}
              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <Link to="/forgot-password" className="text-[#177e4f] hover:underline">
                  Forgot password?
                </Link>
                <Link to="/help" className="inline-flex items-center gap-1 text-[#061b0d]/70 hover:text-[#177e4f]">
                  <span>Help</span>
                  <HelpCircle size={14} />
                </Link>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#061b0d] hover:bg-[#177e4f] text-white text-sm font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : loginMethod === 'phone' ? 'Send OTP Code' : 'Sign In'}</span>
                {!loading && <ArrowRight size={16} className="text-[#4ae278]" />}
              </button>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-[#061b0d]/80">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#177e4f] border-gray-300 focus:ring-[#177e4f]"
                  />
                  <span>Stay signed in on this device</span>
                </label>
              </div>
            </form>

            {/* Social / SSO Section */}
            <div className="mt-8 pt-6 border-t border-[#061b0d]/10 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-[#061b0d]/60 mb-5">
                Or sign in with
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  title="Single Sign-On"
                  className="social-login-btn w-12 h-12 rounded-2xl flex items-center justify-center text-[#061b0d]"
                >
                  <KeyRound size={20} />
                </button>
                <button
                  type="button"
                  title="Official Entity / Institution"
                  className="social-login-btn w-12 h-12 rounded-2xl flex items-center justify-center text-[#061b0d]"
                >
                  <Building2 size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Registration Prompt */}
            <div className="mt-6 text-center text-xs font-medium text-[#061b0d]/70 sm:hidden">
              New to Sahayak?{' '}
              <Link to="/register" className="text-[#177e4f] font-bold hover:underline">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Legal Statement */}
      <footer className="w-full px-6 py-4 text-center text-xs font-medium text-[#061b0d]/60 z-10">
        Sahayak is protected by zero-tracking protocols and standard{' '}
        <Link to="#" className="text-[#177e4f] font-semibold hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="#" className="text-[#177e4f] font-semibold hover:underline">
          Privacy Statement
        </Link>
        .
      </footer>
    </div>
  );
};

export default Login;
