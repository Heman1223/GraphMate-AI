import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUserById,
  getUserByUsername,
  uploadAvatar,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadAvatar as multerUpload } from '../middleware/upload.middleware';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-avatar', protect, multerUpload.single('avatar'), uploadAvatar);
router.get('/username/:username', getUserByUsername);
router.get('/:id', getUserById);

export default router;
