import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = React.useMemo(() => {
    const items = [
      { name: 'Tableau de bord', href: '/dashboard', icon: FiHome, roles: [Role.ADMIN, Role.FORMATEUR, Role.APPRENANT] },
      { name: 'Formations', href: '/formations', icon: FiBook, roles: [Role.ADMIN, Role.FORMATEUR, Role.APPRENANT] },
      { name: 'Apprenants', href: '/apprenants', icon: FiUsers, roles: [Role.ADMIN, Role.FORMATEUR] },
      { name: 'Formateurs', href: '/formateurs', icon: FiUsers, roles: [Role.ADMIN] },
      { name: 'Emploi du temps', href: '/emploi-du-temps', icon: FiCalendar, roles: [Role.ADMIN, Role.FORMATEUR, Role.APPRENANT] },
      { name: 'Évaluations', href: '/evaluations', icon: FiBarChart2, roles: [Role.ADMIN, Role.FORMATEUR, Role.APPRENANT] },
      { name: 'Administration', href: '/admin', icon: FiSettings, roles: [Role.ADMIN] },
    ];

    return items.filter((item) => user && item.roles.includes(user.role));
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-2 p-2 rounded-md hover:bg-gray-100"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h1 className="text-xl font-bold text-primary-600">
                Centre de Formation
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.prenom} {user?.nom}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
