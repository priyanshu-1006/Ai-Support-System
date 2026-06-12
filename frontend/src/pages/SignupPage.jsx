import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, Users } from 'lucide-react';

const carouselSlides = [
  {
    id: 1,
    title: "Join the Future of Support",
    description: "Create an account to experience lightning-fast, AI-powered knowledge retrieval.",
    icon: <Database className="w-16 h-16 text-white mb-6" />,
    gradient: "from-emerald-600 to-teal-800"
  },
  {
    id: 2,
    title: "Connect Your Organization",
    description: "Seamlessly integrate your company's documentation and FAQs into one intelligent hub.",
    icon: <Network className="w-16 h-16 text-white mb-6" />,
    gradient: "from-teal-600 to-cyan-800"
  },
  {
    id: 3,
    title: "Empower Your Team",
    description: "Give your team the tools they need to find answers instantly, without asking repetitive questions.",
    icon: <Users className="w-16 h-16 text-white mb-6" />,
    gradient: "from-cyan-600 to-blue-800"
  }
];

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative overflow-y-auto">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">GAISS</span>
        </div>
        
        <div className="w-full max-w-md mx-auto space-y-6 mt-12 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2 text-lg">
              Join us to start using AI support
            </p>
          </div>

          {(error || formError) && (
            <Alert
              type="error"
              message={error || formError}
              onClose={() => setFormError(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-sm hover:shadow-md transition-all mt-4"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Carousel Showcase */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${carouselSlides[currentSlide].gradient} flex flex-col items-center justify-center p-16 text-center`}
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            
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
              <p className="text-xl text-white/80 leading-relaxed">
                {carouselSlides[currentSlide].description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-20">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
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
