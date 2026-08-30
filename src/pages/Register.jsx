import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card } from '../components';

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
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) newErrors.terms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const getPasswordStrength = () => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength];
  const strengthColor = ['red', 'yellow', 'blue', 'green', 'green'][passwordStrength];

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-600 text-sm mt-1">Join Sahayak today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <Input
            label="Mobile Number"
            placeholder="Enter your 10-digit number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          <Input
            label="Email (Optional)"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded ${
                        i < passwordStrength
                          ? `bg-${strengthColor}-600`
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Strength: <span className={`text-${strengthColor}-600 font-medium`}>{strengthLabel}</span>
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 rounded"
            />
            <span className="text-sm text-gray-700">
              I agree to the Terms and Privacy Policy
            </span>
          </label>
          {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

          <Button fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-blue hover:text-brand-navy font-semibold">
              Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
