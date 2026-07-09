import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { SKILLS_OPTIONS, INTERESTS_OPTIONS, COLLEGES, BRANCHES, CITIES } from '../utils/constants';

export default function OnboardingPage() {
  const { user, updateUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form State
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
    // If profile is already complete, redirect to dashboard
    if (user?.college && user?.skills && user.skills.length > 0) {
      navigate('/dashboard');
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const handleNext = () => {
    if (step === 1) {
      if (!college || !branch || !graduationYear || !city) {
        addToast('Please fill all basic details.', 'error');
        return;
      }
    }
    if (step === 2) {
      if (skills.length === 0) {
        addToast('Please select at least one skill.', 'error');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const updatedUser = await userService.updateProfile({
        college,
        branch,
        graduationYear: parseInt(graduationYear),
        city,
        bio,
        skills,
        interests
      });
      updateUser(updatedUser);
      addToast('Profile setup complete! Welcome to GraphMate.', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      addToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleSelection = (item: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 blur-[100px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome to GraphMate, <span className="gradient-text">{user.name}</span></h1>
          <p className="text-sm text-muted-foreground">Let's build your AI matching index to find the best connections.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <Card className="p-6 md:p-8 min-h-[400px] flex flex-col glass-card relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-1"
              >
                <h2 className="text-xl font-bold mb-4">Academic & Location Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">College / University</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    >
                      <option value="">Select College</option>
                      {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Branch / Major</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      <option value="">Select Branch</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Graduation Year</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                    >
                      <option value="">Select Year</option>
                      {[2024, 2025, 2026, 2027, 2028, 2029].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Current City</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">Select City</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-xl font-bold mb-1">Technical Skills & Bio</h2>
                <p className="text-xs text-muted-foreground mb-4">Select the skills you possess or are currently learning.</p>
                
                <div className="mb-4">
                  <Input 
                    label="Short Bio (Optional)" 
                    placeholder="E.g., Aspiring Full Stack Developer looking for hackathon teammates..." 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 max-h-[200px] custom-scrollbar">
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_OPTIONS.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSelection(skill, skills, setSkills)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          skills.includes(skill)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-xl font-bold mb-1">Interests & Hobbies</h2>
                <p className="text-xs text-muted-foreground mb-4">What do you like to do outside of coding? This helps us find better matches.</p>
                
                <div className="flex-1 overflow-y-auto pr-2 max-h-[250px] custom-scrollbar">
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS_OPTIONS.map(interest => (
                      <button
                        key={interest}
                        onClick={() => toggleSelection(interest, interests, setInterests)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          interests.includes(interest)
                            ? 'bg-cyan-500 text-white border-cyan-500'
                            : 'bg-background border border-border text-muted-foreground hover:border-cyan-500/50'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="mt-8 pt-4 border-t border-border flex justify-between items-center bg-background/50 backdrop-blur z-10">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack} disabled={saving}>Back</Button>
            ) : (
              <div /> // Spacer
            )}
            
            {step < 3 ? (
              <Button variant="primary" onClick={handleNext}>Continue</Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit} loading={saving}>Complete Setup</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
