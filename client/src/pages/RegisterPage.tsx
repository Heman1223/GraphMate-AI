import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register({ name, username, email, password });
      addToast('Registration successful! Welcome to GraphMate.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || 'Registration failed. Try changing username or email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark transition-colors duration-200">
      {/* Left Banner Illustration */}
      <div className="hidden lg:flex flex-col justify-between p-12 gradient-bg-animated text-white relative">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2">
          <span className="text-2xl font-black tracking-tight">GraphMate</span>
          <p className="text-xs text-white/80">Vector-based professional indexing</p>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Build your professional node parameters.
          </h2>
          <p className="text-xs text-white/80 mt-4 leading-relaxed">
            Specify your college major, geographic coordinates, and key programming skills to build your local matching index.
          </p>
        </div>
        
        <div className="relative z-10 text-[10px] text-white/60">
          Developed by Heman Sharma &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Register Form Wrapper */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent-500/5 blur-3xl animate-float" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center lg:text-left mb-8 space-y-2">
            <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark">
              Create Account
            </h1>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Register now to set your profile embeddings parameters.
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Rohan Sharma"
              />
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="rohan_sharma"
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="rohan@college.edu"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <Button type="submit" variant="primary" loading={loading} className="w-full mt-2 font-bold py-3">
                Register
              </Button>
            </form>

            <p className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary-500 hover:underline">
                Sign In
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
