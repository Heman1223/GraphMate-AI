import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-6 text-center transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md space-y-6"
      >
        <h1 className="text-8xl font-black gradient-text tracking-tighter">404</h1>
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Lost in the Social Graph?</h2>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          The node page you're searching for does not exist or has been severed from the network database.
        </p>
        <div className="pt-4">
          <Link to="/" className="btn-primary py-2.5 px-8 text-xs font-bold rounded-xl shadow-lg">
            Return to Node Core
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
