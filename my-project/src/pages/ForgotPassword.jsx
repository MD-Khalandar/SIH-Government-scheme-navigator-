import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Button, Input, Card } from '../components';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: password
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setErrors({ emailOrPhone: 'Email or phone is required' });
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
      setErrors({ otp: 'OTP is required' });
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
    if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(newPassword, confirmPassword);
      navigate('/login', { state: { message: 'Password reset successfully' } });
    } catch (err) {
      setErrors({ submit: err.message });
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
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}
            <Input
              label="Email or Mobile Number"
              placeholder="Enter your email or phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              error={errors.emailOrPhone}
              required
            />
            <Button fullWidth loading={loading}>
              Send Reset Code
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}
            <p className="text-sm text-gray-600">
              We've sent a code to {emailOrPhone}
            </p>
            <Input
              label="Reset Code"
              placeholder="Enter the code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={errors.otp}
              required
            />
            <p className="text-xs text-gray-600">Demo code: 123456</p>
            <Button fullWidth loading={loading}>
              Verify Code
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-4">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />
            <Button fullWidth loading={loading}>
              Reset Password
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-brand-blue hover:text-brand-navy font-semibold">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
