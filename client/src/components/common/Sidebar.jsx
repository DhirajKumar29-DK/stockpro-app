import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, TrendingUp, Briefcase, Wallet, User, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen fixed left-0 top-0 z-30">
        <Link to="/dashboard" className="flex items-center gap-2 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-800 dark:text-white text-lg">StockPro</span>
        </Link>

        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate w-28">{user?.name}</p>
              <p className="text-xs text-gray-400">Investor</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${pathname === path
                  ? 'bg-green-50 dark:bg-green-900/30 text-primary border-r-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-danger w-full transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-30 px-2 py-2">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all
                ${pathname === path ? 'text-primary' : 'text-gray-400'}`}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-gray-400"
          >
            <LogOut size={20} />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;