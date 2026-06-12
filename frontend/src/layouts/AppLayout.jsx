import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from './ui/Button.jsx';
import { Link } from 'react-router-dom';

export function AppLayout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            GAISS
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/chat" className="text-gray-700 hover:text-gray-900">
              Chat
            </Link>
            {user?.role === 'admin' || user?.role === 'super_admin' ? (
              <>
                <Link to="/admin/documents" className="text-gray-700 hover:text-gray-900">
                  Documents
                </Link>
                <Link to="/admin/analytics" className="text-gray-700 hover:text-gray-900">
                  Analytics
                </Link>
                <Link to="/admin/users" className="text-gray-700 hover:text-gray-900">
                  Users
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-600">{user.name}</span>}
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
