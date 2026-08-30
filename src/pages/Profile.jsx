import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Navbar, Sidebar, Card, Button, Input, Select } from '../components';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Profile & Settings" />

        <main className="flex-1 bg-brand-bg overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Personal Information */}
            <Card className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={user?.name || ''}
                    disabled
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                  <Input
                    label="Phone"
                    value={user?.phone || ''}
                    disabled
                  />
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} loading={loading}>Save Changes</Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-lg font-medium text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium text-gray-900">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-medium text-gray-900">{user?.phone}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Eligibility Profile */}
            <Card className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Profile</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-lg font-medium text-gray-900">{profile?.age || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">State</p>
                  <p className="text-lg font-medium text-gray-900">{profile?.state || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Income Range</p>
                  <p className="text-lg font-medium text-gray-900">{profile?.income || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Occupation</p>
                  <p className="text-lg font-medium text-gray-900">{profile?.occupation || 'Not provided'}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate('/app/eligibility-profile')}
                className="mt-6"
              >
                Update Profile
              </Button>
            </Card>

            {/* Security */}
            <Card className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security</h2>
              <div className="space-y-4">
                <Button variant="secondary" fullWidth>
                  Change Password
                </Button>
                <p className="text-sm text-gray-600">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </Card>

            {/* Privacy */}
            <Card className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Data</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your data is stored locally and is not shared with third parties. <a href="#" className="text-brand-blue hover:underline">View Privacy Policy</a>
                </p>
                <Button variant="danger" fullWidth>
                  Delete Account
                </Button>
              </div>
            </Card>

            {/* Logout */}
            <div className="space-y-4">
              <Button
                variant="danger"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
