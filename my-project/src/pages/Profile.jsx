import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Navbar, Sidebar, Input } from '../components';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile || {});
  const [loading, setLoading] = useState(false);

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
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Profile & Settings" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Parameters</span>
              <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">Account & Settings</h1>
            </div>

            {/* Personal Details */}
            <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-normal text-[#14341e]">Personal Record</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1 rounded-full bg-white/60 hover:bg-white text-xs text-[#14341e] border border-[#a9c7b1]/40 transition"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input label="Name" value={user?.name || ''} disabled />
                  <Input label="Email" type="email" value={user?.email || ''} disabled />
                  <Input label="Contact" value={user?.phone || ''} disabled />
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-5 py-2 rounded-full bg-[#177e4f] text-white text-xs hover:bg-[#14341e] transition shadow-sm"
                    >
                      Commit Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2 rounded-full bg-white/60 text-xs text-[#14341e] border border-[#a9c7b1]/40 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-light">
                  <div>
                    <p className="text-[#14341e]/50">Full Name</p>
                    <p className="text-sm font-normal text-[#14341e] mt-1">{user?.name || 'Citizen'}</p>
                  </div>
                  <div>
                    <p className="text-[#14341e]/50">Email Address</p>
                    <p className="text-sm font-normal text-[#14341e] mt-1">{user?.email || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-[#14341e]/50">Registered Line</p>
                    <p className="text-sm font-normal text-[#14341e] mt-1">{user?.phone || 'None'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Criteria Profile */}
            <div className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 mb-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-normal text-[#14341e] mb-5">Active Criteria Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-light mb-6">
                <div>
                  <p className="text-[#14341e]/50">Age</p>
                  <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.age || 'Not defined'}</p>
                </div>
                <div>
                  <p className="text-[#14341e]/50">Territory</p>
                  <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.state || 'Not defined'}</p>
                </div>
                <div>
                  <p className="text-[#14341e]/50">Income</p>
                  <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.income || 'Not defined'}</p>
                </div>
                <div>
                  <p className="text-[#14341e]/50">Occupation</p>
                  <p className="text-sm font-normal text-[#14341e] mt-1">{profile?.occupation || 'Not defined'}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/app/eligibility-profile')}
                className="px-5 py-2 rounded-full bg-white/60 hover:bg-white text-xs text-[#14341e] border border-[#a9c7b1]/40 transition"
              >
                Re-evaluate Profile Criteria
              </button>
            </div>

            {/* Privacy & Logout Controls */}
            <div className="rounded-3xl bg-white/30 backdrop-blur-sm border border-[#a9c7b1]/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-[#14341e]/70 font-light">
                Session state is isolated locally. Revoking credentials clears browser storage.
              </p>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-rose-700/80 hover:bg-rose-800 text-white text-xs font-light transition"
              >
                Terminate Session
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;