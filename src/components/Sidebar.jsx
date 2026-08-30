import React from 'react';
import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Gift,
  Bookmark,
  FileText,
  CheckCircle2,
  HelpCircle,
  User,
  Settings
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/app/dashboard', icon: Home },
  { label: 'Find Benefits', path: '/app/find-benefits', icon: Search },
  { label: 'My Benefits', path: '/app/my-benefits', icon: Gift },
  { label: 'Saved Schemes', path: '/app/saved', icon: Bookmark },
  { label: 'Documents', path: '/app/documents', icon: FileText },
  { label: 'Applications', path: '/app/applications', icon: CheckCircle2 },
];

const bottomItems = [
  { label: 'Help', path: '/app/help', icon: HelpCircle },
  { label: 'Profile', path: '/app/profile', icon: User },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between lg:hidden">
          <h2 className="font-bold text-brand-blue">Menu</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    active
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    active
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
