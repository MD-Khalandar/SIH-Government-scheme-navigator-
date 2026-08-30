import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card } from '../components';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');

  const validateForm = () => {
    const newErrors = {};
    if (!emailOrPhone) newErrors.emailOrPhone = loginMethod === 'email' ? 'Email is required' : 'Phone number is required';
    if (loginMethod === 'email' && !password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (loginMethod === 'phone') {
        const authService = (await import('../services/authService')).default;
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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                loginMethod === 'email' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-600'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                loginMethod === 'phone' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-600'
              }`}
            >
              Phone
            </button>
          </div>

          <Input
            label={loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
            placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
            type={loginMethod === 'email' ? 'email' : 'tel'}
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            error={errors.emailOrPhone}
          />

          {loginMethod === 'email' && (
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-brand-blue hover:text-brand-navy">
              Forgot Password?
            </Link>
          </div>

          <Button fullWidth loading={loading}>
            Login
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">OR</span>
            </div>
          </div>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setLoginMethod('phone');
              setTimeout(() => document.querySelector('input[type="tel"]')?.focus(), 50);
            }}
            type="button"
          >
            Continue with Mobile OTP
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-blue hover:text-brand-navy font-semibold">
              Register
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Firebase account:</strong> Use your email and password to continue.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
