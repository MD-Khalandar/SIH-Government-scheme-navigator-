import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { Button, Card } from '../components';

export const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';
  const mode = location.state?.mode || 'email';
  const fullName = location.state?.fullName || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (mode !== 'phone-login' && mode !== 'phone-register') {
      navigate('/login', { replace: true });
      return undefined;
    }

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
  }, []);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

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
      setError('Please enter all 6 digits');
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
      if (mode === 'phone-login' || mode === 'phone-register') {
        await authService.sendPhoneOTP(phone, fullName);
      }
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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify your number</h1>
          <p className="text-gray-600 text-sm mt-2">
            OTP sent to <strong>{phone || '+91 XXXXX XXXXX'}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Enter OTP</label>
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
                  className="w-12 h-12 text-2xl font-bold text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-700">
              Resend OTP in{' '}
              <span className="font-bold text-brand-blue">
                00:{timeLeft.toString().padStart(2, '0')}
              </span>
            </p>
          </div>

          <Button fullWidth loading={loading}>
            Verify OTP
          </Button>

          <Button
            variant="ghost"
            fullWidth
            onClick={handleResend}
            disabled={!canResend || loading}
            type="button"
          >
            Resend OTP
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default OTPVerification;
