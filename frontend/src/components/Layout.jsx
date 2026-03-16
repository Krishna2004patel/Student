import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, CustomDashboardIcon, LogOut, Menu, User, Settings, GraduationCap } from 'lucide-react';
import authService from '../services/auth.service';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: GraduationCap },
    ...(user?.role === 'admin' ? [{ name: 'Manage Courses', path: '/courses', icon: BookOpen }] : []),
    ...(user?.role === 'admin' ? [{ name: 'Manage Students', path: '/students', icon: User }] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
          <BookOpen className="w-8 h-8 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-800 tracking-tight">EduPortal</span>
        </div>
        
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex justify-end items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Welcome, {user?.name} ({user?.role})
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase ring-2 ring-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
