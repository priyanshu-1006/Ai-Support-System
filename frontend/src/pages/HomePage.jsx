import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';

export function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">GAISS</h1>
            <p className="text-sm text-gray-600">Gryork AI Support System</p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-700">Welcome, {user.name}</span>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardBody className="py-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to AI Support
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Ask anything about Gryork and get instant, accurate answers powered by
              AI. Our system learns from your knowledge base to provide contextual
              support.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/chat')}
              className="inline-block"
            >
              Start Chatting →
            </Button>
          </CardBody>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardBody>
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Powered
              </h3>
              <p className="text-gray-600">
                Powered by Gemini and Groq for fast, accurate responses
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Knowledge Base
              </h3>
              <p className="text-gray-600">
                Answers based on your organization's documents and FAQs
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Answers
              </h3>
              <p className="text-gray-600">
                Get responses in seconds, no waiting for human support
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' || user?.role === 'super_admin' ? (
          <Card className="bg-indigo-50 border-indigo-200">
            <CardHeader className="bg-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-900">
                Admin Panel
              </h3>
            </CardHeader>
            <CardBody className="flex gap-4">
              <Button
                variant="primary"
                onClick={() => navigate('/admin/documents')}
              >
                Manage Documents
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/admin/analytics')}
              >
                View Analytics
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
            </CardBody>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
