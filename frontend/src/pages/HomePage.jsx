import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Bot, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-transparent transition-colors pt-12 pb-24 relative">
      {/* Animated Blobs for Background */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 dark:opacity-40 animate-blob dark:bg-purple-500"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 dark:opacity-40 animate-blob animation-delay-2000 dark:bg-cyan-500"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 dark:opacity-40 animate-blob animation-delay-4000 dark:bg-pink-500"></div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <Card className="mb-12 border-0 shadow-2xl glass-panel">
              <CardBody className="py-20 text-center">
                <motion.h2 
                  className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-300 dark:to-blue-400 mb-6 tracking-tight"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  Welcome to AI Support
                </motion.h2>
                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Ask anything about Gryork and get instant, accurate answers powered by AI. 
                  Our system learns from your knowledge base to provide contextual support.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                  <Button
                    size="lg"
                    onClick={() => navigate('/chat')}
                    className="inline-flex items-center gap-2 text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg text-white"
                  >
                    Start Chatting <Zap size={20} className="fill-current" />
                  </Button>
                </motion.div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div variants={itemVariants} whileHover={{ y: -10 }}>
              <Card className="h-full glass-panel hover:shadow-2xl transition-all">
                <CardBody className="flex flex-col items-center text-center p-8">
                  <div className="p-4 bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mb-6 shadow-inner">
                    <Bot size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">AI Powered</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Powered by state-of-the-art LLMs for fast, accurate responses
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -10 }}>
              <Card className="h-full glass-panel hover:shadow-2xl transition-all">
                <CardBody className="flex flex-col items-center text-center p-8">
                  <div className="p-4 bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full mb-6 shadow-inner">
                    <BookOpen size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Knowledge Base</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Answers strictly based on your organization's documents and FAQs
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -10 }}>
              <Card className="h-full glass-panel hover:shadow-2xl transition-all">
                <CardBody className="flex flex-col items-center text-center p-8">
                  <div className="p-4 bg-purple-100/80 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full mb-6 shadow-inner">
                    <Zap size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Instant Answers</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Get responses in seconds, no waiting in line for human support
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Admin Section */}
          {user?.role === 'admin' || user?.role === 'super_admin' ? (
            <motion.div variants={itemVariants}>
              <Card className="glass-panel">
                <CardHeader className="border-b border-indigo-200/50 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/20">
                  <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 text-center">
                    Admin Panel Quick Actions
                  </h3>
                </CardHeader>
                <CardBody className="flex flex-col sm:flex-row gap-4 justify-center py-8">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full sm:w-auto" onClick={() => navigate('/admin/documents')}>
                      Manage Documents
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full sm:w-auto" onClick={() => navigate('/admin/analytics')}>
                      View Analytics
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full sm:w-auto" onClick={() => navigate('/admin/users')}>
                      Manage Users
                    </Button>
                  </motion.div>
                </CardBody>
              </Card>
            </motion.div>
          ) : null}
        </motion.div>
      </main>
    </div>
  );
}
