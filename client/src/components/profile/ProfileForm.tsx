import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { 
  COLLEGES, 
  CITIES, 
  BRANCHES, 
  SKILLS_OPTIONS, 
  INTERESTS_OPTIONS 
} from '../../utils/constants';
import type { IUser, IUserUpdate } from '../../types';

interface ProfileFormProps {
  initialUser: IUser;
  onSave: (data: IUserUpdate) => Promise<void>;
  loading: boolean;
}

export default function ProfileForm({ initialUser, onSave, loading }: ProfileFormProps) {
  const [name, setName] = useState(initialUser.name);
  const [bio, setBio] = useState(initialUser.bio || '');
  const [college, setCollege] = useState(initialUser.college || COLLEGES[0]);
  const [branch, setBranch] = useState(initialUser.branch || BRANCHES[0]);
  const [graduationYear, setGraduationYear] = useState(initialUser.graduationYear || 2026);
  const [city, setCity] = useState(initialUser.city || CITIES[0]);
  const [skills, setSkills] = useState<string[]>(initialUser.skills || []);
  const [interests, setInterests] = useState<string[]>(initialUser.interests || []);
  const [github, setGithub] = useState(initialUser.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(initialUser.socialLinks?.linkedin || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      bio,
      college,
      branch,
      graduationYear,
      city,
      skills,
      interests,
      socialLinks: { github, linkedin }
    });
  };

  const handleToggleSkill = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleToggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />

          <div>
            <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              Graduation Year
            </label>
            <input
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-text-primary-light dark:text-text-primary-dark"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              Academic College
            </label>
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-text-primary-light dark:text-text-primary-dark"
            >
              {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              Branch / Major
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-text-primary-light dark:text-text-primary-dark"
            >
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-text-primary-light dark:text-text-primary-dark"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="GitHub URL" 
              value={github} 
              onChange={(e) => setGithub(e.target.value)} 
              placeholder="https://github.com/..." 
            />
            <Input 
              label="LinkedIn URL" 
              value={linkedin} 
              onChange={(e) => setLinkedin(e.target.value)} 
              placeholder="https://linkedin.com/in/..." 
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-text-primary-light dark:text-text-primary-dark"
            rows={3}
            placeholder="Write a brief professional bio describing your skills..."
          />
        </div>

        {/* Skills Multi-select */}
        <div>
          <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
            Select Skills ({skills.length} selected)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-3 border border-border-light/60 dark:border-border-dark/60 rounded-xl bg-bg-secondary-light/20 dark:bg-bg-secondary-dark/20">
            {SKILLS_OPTIONS.map(skill => {
              const selected = skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    selected 
                      ? 'bg-primary-500/10 text-primary-600 border-primary-500/30' 
                      : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-bg-secondary-light'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests Multi-select */}
        <div>
          <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
            Select Interests ({interests.length} selected)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-3 border border-border-light/60 dark:border-border-dark/60 rounded-xl bg-bg-secondary-light/20 dark:bg-bg-secondary-dark/20">
            {INTERESTS_OPTIONS.map(interest => {
              const selected = interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => handleToggleInterest(interest)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    selected 
                      ? 'bg-accent-500/10 text-accent-600 border-accent-500/30' 
                      : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-bg-secondary-light'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-light/10 dark:border-border-dark/10">
          <Button type="submit" variant="primary" loading={loading} className="px-8 font-bold">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
