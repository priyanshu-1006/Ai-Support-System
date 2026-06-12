import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Bot, BookOpen, Zap } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 transition-colors pt-12 pb-24">
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero Section */}
        <Card className="mb-12 border-0 shadow-xl dark:bg-slate-800/80 backdrop-blur-sm">
          <CardBody className="py-16 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Welcome to AI Support
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Ask anything about Gryork and get instant, accurate answers powered by
              AI. Our system learns from your knowledge base to provide contextual
              support.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              Start Chatting <Zap size={20} className="fill-current" />
            </Button>
          </CardBody>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
            <CardBody className="flex flex-col items-center text-center p-8">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mb-6">
                <Bot size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                AI Powered
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Powered by state-of-the-art LLMs for fast, accurate responses
              </p>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
            <CardBody className="flex flex-col items-center text-center p-8">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full mb-6">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Knowledge Base
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Answers strictly based on your organization's documents and FAQs
              </p>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
            <CardBody className="flex flex-col items-center text-center p-8">
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-full mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Instant Answers
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get responses in seconds, no waiting in line for human support
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' || user?.role === 'super_admin' ? (
          <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/50">
            <CardHeader className="bg-indigo-100 dark:bg-indigo-900/40 border-b border-indigo-200 dark:border-indigo-800/50">
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">
                Admin Panel Quick Actions
              </h3>
            </CardHeader>
            <CardBody className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="w-full sm:w-auto"
                onClick={() => navigate('/admin/documents')}
              >
                Manage Documents
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => navigate('/admin/analytics')}
              >
                View Analytics
              </Button>
              <Button
                className="w-full sm:w-auto"
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
