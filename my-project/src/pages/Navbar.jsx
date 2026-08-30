import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import './Navbar.css';

export const Navbar = ({ title = 'Dashboard', onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-3 z-30 w-full px-4 sm:px-8 lg:px-12 font-navbar">
      <div className="lucid-glass-navbar rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left Section: Menu trigger + Page Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle Navigation Sidebar"
            className="nav-icon-btn w-9 h-9 rounded-xl flex items-center justify-center lg:hidden flex-shrink-0"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#061b0d] tracking-tight">
              {title}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#177e4f]/15 text-[#177e4f] text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck size={11} />
              <span>Verified Portal</span>
            </span>
          </div>
        </div>

        {/* Right Section: Quick Actions & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Find Link */}
          <Link
            to="/app/find-benefits"
            title="Search all schemes"
            className="nav-icon-btn hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-[#061b0d]"
          >
            <Search size={16} />
          </Link>

          {/* Notifications / Alerts Indicator */}
          <button
            type="button"
            title="Notifications"
            className="nav-icon-btn relative w-9 h-9 rounded-xl flex items-center justify-center text-[#061b0d]"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#177e4f] ring-2 ring-white" />
          </button>

          {/* User Profile Capsule */}
          <div className="nav-profile-pill flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#061b0d] to-[#177e4f] text-[#c9f3ce] text-xs font-extrabold flex items-center justify-center flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-extrabold text-[#061b0d] max-w-[110px] truncate">
                {user?.name || 'Citizen'}
              </p>
              <p className="text-[10px] font-semibold text-[#0a2e14]/65">
                Enrolled
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="text-[#061b0d]/50 hover:text-rose-700 transition-colors ml-1"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;