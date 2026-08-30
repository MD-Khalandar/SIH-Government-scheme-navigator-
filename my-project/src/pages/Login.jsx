import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!emailOrPhone) newErrors.emailOrPhone = 'Contact parameter required';
    if (!password) newErrors.password = 'Credential key required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
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

          <Input
            label="Email or Mobile Contact"
            placeholder="citizen@domain.com"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            error={errors.emailOrPhone}
          />

          <Input
            label="Access Key"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-light text-[#14341e]/70">
              <input type="checkbox" className="rounded border-[#a9c7b1] text-[#177e4f] focus:ring-0" defaultChecked />
              <span>Preserve Session</span>
            </label>
            <Link to="/forgot-password" className="text-[#177e4f] hover:text-[#14341e] font-light">
              Forgot Key?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-[#177e4f] hover:bg-[#14341e] text-white text-xs font-normal transition shadow-sm mt-3"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-light text-[#14341e]/70">
          Unregistered citizen?{' '}
          <Link to="/register" className="text-[#177e4f] font-normal hover:underline">
            Initiate Profile
          </Link>
        </div>

        <div className="mt-6 p-3.5 bg-white/30 rounded-2xl border border-[#a9c7b1]/30 text-center">
          <p className="text-[11px] text-[#14341e]/60 font-light">
            Simulation profile: any valid contact string with key <code>demo123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;