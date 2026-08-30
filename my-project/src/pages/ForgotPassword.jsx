import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Button, Input } from '../components';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setErrors({ emailOrPhone: 'Identifier is required' });
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(emailOrPhone);
      setStep(2);
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrors({ otp: 'Code required' });
      return;
    }
    setLoading(true);
    try {
      await authService.verifyOTP(otp);
      setStep(3);
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = 'Password is required';
    if (newPassword.length < 6) newErrors.newPassword = 'Must be 6+ characters';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(newPassword, confirmPassword);
      navigate('/login', { state: { message: 'Password updated successfully' } });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans flex items-center justify-center px-4 selection:bg-[#4ae278]">
      <div className="w-full max-w-md rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full bg-[#177e4f] text-[#c9f3ce] font-heading font-medium flex items-center justify-center mx-auto mb-3 shadow-sm">
            S
          </div>
          <h1 className="text-2xl font-light text-[#14341e]">Password Recovery</h1>
          <p className="text-xs text-[#14341e]/60 font-light mt-1">Reset your portal credentials</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            {errors.submit && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-2.5 rounded-xl">
                {errors.submit}
              </div>
            )}
            <Input
              label="Email or Mobile Contact"
              placeholder="name@domain.com"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              error={errors.emailOrPhone}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-[#177e4f] hover:bg-[#14341e] text-white text-xs font-normal transition shadow-sm mt-2"
            >
              {loading ? 'Dispatching...' : 'Dispatch Verification Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            {errors.submit && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-2.5 rounded-xl">
                {errors.submit}
              </div>
            )}
            <Input
              label="Verification Code"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={errors.otp}
              required
            />
            <p className="text-[11px] text-[#14341e]/50 font-light">Simulation Code: 123456</p>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-[#177e4f] hover:bg-[#14341e] text-white text-xs font-normal transition shadow-sm mt-2"
            >
              {loading ? 'Verifying...' : 'Validate Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-4">
            {errors.submit && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-2.5 rounded-xl">
                {errors.submit}
              </div>
            )}
            <Input
              label="New Key"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              required
            />
            <Input
              label="Confirm Key"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-[#177e4f] hover:bg-[#14341e] text-white text-xs font-normal transition shadow-sm mt-2"
            >
              {loading ? 'Updating...' : 'Set New Credentials'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs text-[#177e4f] hover:text-[#14341e] transition">
            Return to authentication
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;