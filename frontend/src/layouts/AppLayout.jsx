import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Sun, Moon, Menu, X } from 'lucide-react';

export function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              GAISS
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/chat" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Chat
            </Link>
            {user?.role === 'admin' || user?.role === 'super_admin' ? (
              <>
                <Link to="/admin/documents" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Documents
                </Link>
                <Link to="/admin/analytics" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Analytics
                </Link>
                <Link to="/admin/users" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Users
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">{user.name}</span>
                <Button size="sm" variant="ghost" onClick={handleLogout} className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Chat
            </Link>
            {user?.role === 'admin' || user?.role === 'super_admin' ? (
              <>
                <Link to="/admin/documents" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Documents
                </Link>
                <Link to="/admin/analytics" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Analytics
                </Link>
                <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Users
                </Link>
              </>
            ) : null}
            {user && (
              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{user.name}</span>
                <Button size="sm" variant="ghost" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="dark:text-gray-300">
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
