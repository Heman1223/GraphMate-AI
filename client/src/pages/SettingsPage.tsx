import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      addToast('Password updated successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setLoading(false);
    }, 1000);
  };

  const themeOptions = [
    { value: 'light', label: 'Light Mode', emoji: '☀️' },
    { value: 'dark', label: 'Dark Mode', emoji: '🌙' },
    { value: 'system', label: 'System Theme', emoji: '💻' }
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 max-w-3xl"
    >
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">
          Settings
        </h1>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          Manage your theme preferences, password controls, and account settings.
        </p>
      </div>

      {/* Theme Options */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
          Visual Theme
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions.map((opt) => {
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  active 
                    ? 'border-primary-500 bg-primary-500/5 text-primary-600 dark:text-primary-400' 
                    : 'border-border-light dark:border-border-dark bg-bg-secondary-light/40 dark:bg-bg-secondary-dark/40 text-text-secondary-light dark:text-text-secondary-dark hover:bg-bg-secondary-light'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Password controls */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
          Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" loading={loading} className="px-6 font-bold text-xs py-2">
              Update password
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border border-error/20 bg-error/5">
        <h3 className="text-sm font-bold text-error mb-2">
          Danger Zone
        </h3>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-4 leading-relaxed">
          Deleting your profile is permanent and removes all friendship connections, requests, and cached vector indexes.
        </p>
        <Button variant="danger" className="text-xs font-bold py-2 px-6">
          Delete Profile
        </Button>
      </Card>
    </motion.div>
  );
}
