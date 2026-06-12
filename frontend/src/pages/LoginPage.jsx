import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, MessageSquare, ShieldCheck } from 'lucide-react';

const carouselSlides = [
  {
    id: 1,
    title: "Instant AI Knowledge",
    description: "Get accurate, instant answers from your internal knowledge base with our advanced RAG pipeline.",
    icon: <BrainCircuit className="w-16 h-16 text-white mb-6" />,
    gradient: "from-blue-600 to-indigo-800"
  },
  {
    id: 2,
    title: "Context-Aware Conversations",
    description: "Seamless chat experience that remembers previous context to help you solve problems faster.",
    icon: <MessageSquare className="w-16 h-16 text-white mb-6" />,
    gradient: "from-indigo-600 to-purple-800"
  },
  {
    id: 3,
    title: "Secure & Managed",
    description: "Role-based access control and comprehensive admin dashboard to keep your data safe and organized.",
    icon: <ShieldCheck className="w-16 h-16 text-white mb-6" />,
    gradient: "from-purple-600 to-blue-800"
  }
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-transparent transition-colors">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">GAISS</span>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="glass-panel border-white/40 dark:border-slate-700/50 shadow-2xl">
              <CardBody className="p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome Back</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                    Sign in to your account to continue
                  </p>
                </div>

                {(error || formError) && (
                  <Alert
                    type="error"
                    message={error || formError}
                    onClose={() => setFormError(null)}
                  />
                )}

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                  <div className="space-y-5">
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">Forgot password?</a>
                      </div>
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Right side - Carousel Showcase */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 rounded-l-3xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${carouselSlides[currentSlide].gradient} flex flex-col items-center justify-center p-16 text-center`}
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center max-w-xl"
            >
              {carouselSlides[currentSlide].icon}
              <h2 className="text-4xl font-bold text-white mb-6">
                {carouselSlides[currentSlide].title}
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                {carouselSlides[currentSlide].description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-20">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                index === currentSlide ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
