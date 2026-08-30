import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { 
  ArrowLeft, 
  ArrowRight, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import stackedPeaks from '../assets/stacked-peaks-haikei.svg';
import forgotPasswordIllustration from '../assets/undraw_forgot-password_nttj.svg';
import './ForgotPassword.css';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Registered email address is required');
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      navigate('/login', { state: { message: 'Reset link dispatched. Check your inbox.' } });
    } catch (err) {
      setError(err.message || 'Unable to process recovery request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-page-canvas min-h-screen w-full font-recovery flex flex-col justify-between items-center px-4 py-6 selection:bg-[#2fe066] selection:text-[#061b0d] relative overflow-hidden">
      
      {/* Background Vector Peaks Landscape */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none -z-20 leading-none">
        <img
          src={stackedPeaks}
          alt=""
          aria-hidden="true"
          className="w-full h-auto max-h-[220px] object-cover object-bottom opacity-25 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#c2f0c8]/60 to-transparent" />
      </div>

      {/* Screen Bottom-Right Illustration */}
      <div className="fixed bottom-0 right-4 pointer-events-none -z-10 hidden md:block max-w-[220px] lg:max-w-[260px] opacity-85 select-none">
        <img
          src={forgotPasswordIllustration}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain object-bottom filter drop-shadow-xs"
        />
      </div>

      {/* Header */}
      <header className="w-full max-w-sm flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-base tracking-tight text-[#061b0d]">
          <span className="w-7 h-7 rounded-full bg-[#177e4f] text-[#c9f3ce] flex items-center justify-center text-xs shadow-xs">S</span>
          SAHAYAK
        </Link>
        <Link 
          to="/login" 
          className="text-xs font-semibold text-[#0a2e14]/75 hover:text-[#177e4f] inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={13} /> Sign In
        </Link>
      </header>

      {/* Main Glass Card */}
      <main className="w-full max-w-sm z-10 my-auto">
        <div className="lucid-glass-card-sm rounded-3xl p-6 sm:p-7">
          
          {/* Title & Icon Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#177e4f]/15 text-[#177e4f] flex items-center justify-center shadow-xs flex-shrink-0">
              <KeyRound size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-[#061b0d]">Reset Access Key</h1>
              <p className="text-xs font-medium text-[#0a2e14]/70">Enter your email to receive recovery instructions</p>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3 py-2 rounded-lg mb-4 flex items-center gap-1.5 font-medium">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0a2e14]/75 ml-0.5">
                Registered Email Address
              </label>
              <input
                type="email"
                placeholder="citizen@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="lucid-input-field w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-mild w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{loading ? 'Transmitting...' : 'Send Recovery Link'}</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Verification Badge */}
          <div className="subtle-badge mt-5 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#0a2e14]/80">
            <ShieldCheck size={14} className="text-[#177e4f] flex-shrink-0" />
            <span>Encrypted on-device protocol</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-[11px] font-semibold text-[#0a2e14]/65 z-10">
        Sahayak Welfare Gateway &bull; Smart India Hackathon 2026
      </footer>
    </div>
  );
};

export default ForgotPassword;
