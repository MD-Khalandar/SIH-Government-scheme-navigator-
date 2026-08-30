import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2 
} from 'lucide-react';
import authenticationIllustration from '../assets/undraw_authentication_1evl.svg';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    }
    if (!password) {
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
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-canvas min-h-screen w-full text-[#061b0d] font-login flex flex-col justify-between selection:bg-[#2fe066] selection:text-[#061b0d] overflow-x-hidden antialiased">
      
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
            New to Sahayak?{' '}
            <Link to="/register" className="text-[#177e4f] font-bold hover:underline ml-1">
              Sign Up Free
            </Link>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-6 sm:py-10 z-10">
        <div className="lucid-glass-card w-full max-w-5xl rounded-[2.5rem] p-8 sm:p-12 lg:p-14 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual & Badges */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between h-full border-r border-[#061b0d]/15 pr-10">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#177e4f]/20 text-[#061b0d] text-xs font-bold uppercase tracking-wider border border-[#177e4f]/30">
                <ShieldCheck size={14} className="text-[#177e4f]" />
                Verified Citizen Portal
              </span>
              <h2 className="text-3xl font-extrabold text-[#061b0d] tracking-tight leading-tight">
                One unified key for all public benefits.
              </h2>
              <p className="text-sm font-medium text-[#0a2e14] leading-relaxed">
                Connect your state and central entitlements securely with zero third-party commercial data retention.
              </p>
            </div>

            {/* Graphic Illustration Card */}
            <div className="relative my-8 rounded-2xl overflow-hidden border border-white/90 shadow-md bg-gradient-to-br from-[#177e4f]/25 via-white/50 to-[#c9f3ce]/70 p-5">
              <img
                src={authenticationIllustration}
                alt="Secure authentication illustration"
                className="w-full h-40 object-contain object-bottom opacity-95 rounded-xl mb-4"
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

            <p className="text-xs font-semibold text-[#0a2e14]">
              Assisting over 2,400+ national, state, and rural assistance programs.
            </p>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061b0d] tracking-tight">
                Sign In
              </h1>
              <p className="text-sm font-medium text-[#0a2e14] mt-2">
                Enter your account credentials to continue
              </p>
            </div>

            {errors.submit && (
              <div className="bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold px-4 py-3 rounded-2xl mb-6 shadow-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lucid-input-field w-full px-5 py-3.5 text-sm font-bold rounded-xl outline-none"
                />
                {errors.email && (
                  <p className="text-xs font-bold text-rose-800 ml-1 mt-1.5">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="lucid-input-field w-full px-5 py-3.5 text-sm font-bold rounded-xl outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0a2e14] hover:text-[#061b0d] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-xs font-bold text-rose-800 ml-1 mt-1.5">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-end text-xs font-bold pt-1">
                <Link to="/forgot-password" className="text-[#177e4f] hover:text-[#061b0d] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#061b0d] hover:bg-[#177e4f] text-[#c9f3ce] hover:text-white text-sm font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && <ArrowRight size={16} className="text-[#4ae278]" />}
              </button>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-[#061b0d]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#177e4f] border-[#061b0d]/30 focus:ring-[#177e4f]"
                  />
                  <span>Stay signed in on this device</span>
                </label>
              </div>
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

export default Login;