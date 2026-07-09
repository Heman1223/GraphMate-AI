import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/profile/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import type { IUserUpdate } from '../types';
import { motion } from 'framer-motion';

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: IUserUpdate) => {
    try {
      setSaving(true);
      const updated = await userService.updateProfile(data);
      updateUser(updated);
      navigate(`/profile/${updated.username}`);
    } catch (err) {
      console.error('Failed to save profile changes:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">
          Edit Profile
        </h1>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          Update your academic, geolocation, and technical skills parameters. Your profile embedding cache will automatically re-compute.
        </p>
      </div>

      <ProfileForm initialUser={user} onSave={handleSave} loading={saving} />
    </motion.div>
  );
}
