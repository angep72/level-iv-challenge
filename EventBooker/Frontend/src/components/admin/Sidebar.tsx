import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: ROUTES.ADMIN_DASHBOARD,
    },
    {
      icon: Plus,
      label: 'Create Event',
      path: ROUTES.ADMIN_CREATE_EVENT,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;