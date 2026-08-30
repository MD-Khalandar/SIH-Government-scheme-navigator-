import React, { useState } from 'react';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = ({ title, onMenuClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/90 bg-white/80 backdrop-blur-md shadow-[0_12px_30px_rgba(6,27,13,0.03)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="rounded-lg p-2 transition hover:bg-[#177e4f]/10 lg:hidden"
            >
              <Menu size={20} className="text-[#061b0d]" />
            </button>
            <Link to={isAuthenticated ? '/app/dashboard' : '/'} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#061b0d] text-sm font-bold text-white shadow-sm">
                <span>S</span>
              </div>
              <div className="hidden sm:block">
                <span className="block text-lg font-extrabold leading-tight text-[#061b0d]">SAHAYAK</span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0a2e14]/70">Benefits Navigator</p>
              </div>
            </Link>
          </div>

          {title && (
            <div className="hidden flex-1 text-center sm:block">
              <h2 className="text-lg font-bold text-[#061b0d]">{title}</h2>
            </div>
          )}

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <button className="relative rounded-lg p-2 transition hover:bg-[#177e4f]/10">
                  <Bell size={20} className="text-[#061b0d]" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 rounded-lg p-2 transition hover:bg-[#177e4f]/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#177e4f] text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden text-sm font-semibold text-[#061b0d] sm:inline">
                      {user?.name}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[#dfeee3] bg-white/95 shadow-xl backdrop-blur-sm">
                      <div className="border-b border-[#dfeee3] p-4">
                        <p className="font-bold text-[#061b0d]">{user?.name}</p>
                        <p className="text-sm text-[#0a2e14]/70">{user?.email || user?.phone}</p>
                      </div>
                      <Link
                        to="/app/profile"
                        className="flex items-center gap-2 px-4 py-2 text-[#061b0d] transition hover:bg-[#177e4f]/5"
                      >
                        <User size={16} /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
