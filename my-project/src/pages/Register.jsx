import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name required';
    if (!formData.phone) newErrors.phone = 'Mobile line required';
    if (!formData.password) newErrors.password = 'Credential key required';
    if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Keys mismatch';
    if (!agreeTerms) newErrors.terms = 'Consent acknowledgment required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register(formData);
      navigate('/verify-otp', { state: { phone: formData.phone } });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans flex items-center justify-center px-4 selection:bg-[#4ae278] py-12">
      <div className="w-full max-w-md rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full bg-[#177e4f] text-[#c9f3ce] font-heading font-medium flex items-center justify-center mx-auto mb-3 shadow-sm">
            S
          </div>
          <h1 className="text-2xl font-light text-[#14341e]">Citizen Onboarding</h1>
          <p className="text-xs text-[#14341e]/60 font-light mt-1">Initialize eligibility profile credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-2.5 rounded-xl">
              {errors.submit}
            </div>
          )}

          <Input
            label="Citizen Name"
            placeholder="First and last designation"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <Input
            label="Mobile Number"
            placeholder="10-digit number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          <Input
            label="Electronic Mail (Optional)"
            type="email"
            placeholder="citizen@domain.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Security Key"
            type="password"
            placeholder="6+ characters"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Input
            label="Confirm Key"
            type="password"
            placeholder="Re-enter security key"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <label className="flex items-start gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-[#a9c7b1] text-[#177e4f] focus:ring-0"
            />
            <span className="text-[11px] font-light text-[#14341e]/70 leading-relaxed">
              I consent to anonymous algorithmic matching against government assistance rulesets.
            </span>
          </label>
          {errors.terms && <p className="text-[11px] text-rose-700">{errors.terms}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-[#177e4f] hover:bg-[#14341e] text-white text-xs font-normal transition shadow-sm mt-3"
          >
            {loading ? 'Creating Record...' : 'Generate Profile'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-light text-[#14341e]/70">
          Enrolled already?{' '}
          <Link to="/login" className="text-[#177e4f] font-normal hover:underline">
            Authenticate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;