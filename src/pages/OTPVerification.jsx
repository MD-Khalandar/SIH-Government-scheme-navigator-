import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

export const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';
  const mode = location.state?.mode || 'phone-login';
  const fullName = location.state?.fullName || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!phone || (mode !== 'phone-login' && mode !== 'phone-register')) {
      navigate('/login', { replace: true });
      return undefined;
    }

    const sendOtp = async () => {
      try {
        await authService.sendPhoneOTP(phone);
      } catch (err) {
        setError(err.message);
      }
    };

    sendOtp();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, navigate, phone]);

  const handleOtpChange = (value, index) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleBackspace = (index, value) => {
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please provide the full 6-digit key');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (mode === 'phone-login') {
        await authService.verifyPhoneLogin(otpValue);
        navigate('/app/dashboard');
        return;
      }

      if (mode === 'phone-register') {
        await authService.verifyPhoneRegister({ otp: otpValue, fullName, phone });
        navigate('/app/onboarding');
        return;
      }

      throw new Error('Start phone verification from the login or registration page.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await authService.sendPhoneOTP(phone);
      setTimeLeft(30);
      setCanResend(false);
      setError('');
    } catch (err) {
      setError(err.message);
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
          <h1 className="text-2xl font-light text-[#14341e]">Handshake Verification</h1>
          <p className="text-xs text-[#14341e]/60 font-light mt-1">
            Authentication token dispatched to <strong>{phone || 'registered target'}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') handleBackspace(index, digit);
                  }}
                  className="w-10 h-12 text-center text-lg font-light rounded-xl bg-white/70 border border-[#a9c7b1]/60 focus:outline-none focus:border-[#177e4f]"
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-[#14341e]/60 font-light">
              Token expires in <span className="font-mono text-[#177e4f]">00:{timeLeft.toString().padStart(2, '0')}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-[#177e4f] hover:bg-[#14341e] text-white text-xs font-normal transition shadow-sm"
          >
            {loading ? 'Validating...' : 'Confirm Authentication'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || loading}
            className="w-full text-xs text-[#177e4f] hover:text-[#14341e] disabled:opacity-40 transition"
          >
            Re-send One-Time Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;