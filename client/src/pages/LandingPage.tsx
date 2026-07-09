import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import NetworkDemo from '../components/landing/NetworkDemo';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200"
    >
      <Navbar />
      <div className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <NetworkDemo />
        <Testimonials />
        <CTA />
      </div>
      <Footer />
    </motion.div>
  );
}
