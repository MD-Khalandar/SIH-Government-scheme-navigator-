import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { Button, Input } from '../components';

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
    if (!emailOrPhone) {
      newErrors.emailOrPhone = loginMethod === 'email' ? 'Email is required' : 'Phone number is required';
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
    <div className="min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans flex items-center justify-center px-4 selection:bg-[#4ae278]">
      <div className="w-full max-w-md rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full bg-[#177e4f] text-[#c9f3ce] font-heading font-medium flex items-center justify-center mx-auto mb-3 shadow-sm">
            S
          </div>
          <h1 className="text-2xl font-light text-[#14341e]">Citizen Access</h1>
          <p className="text-xs text-[#14341e]/60 font-light mt-1">Authenticate to inspect recorded entitlements</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-2.5 rounded-xl">
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
            type={loginMethod === 'email' ? 'email' : 'tel'}
            placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-light text-[#14341e]/70">
              <input type="checkbox" className="rounded border-[#a9c7b1] text-[#177e4f] focus:ring-0" defaultChecked />
              <span>Preserve Session</span>
            </label>
            <Link to="/forgot-password" className="text-[#177e4f] hover:text-[#14341e] font-light">
              Forgot Key?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs font-light text-[#14341e]/70">
          Unregistered citizen?{' '}
          <Link to="/register" className="text-[#177e4f] font-normal hover:underline">
            Initiate Profile
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Firebase account:</strong> Use your email and password to continue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;