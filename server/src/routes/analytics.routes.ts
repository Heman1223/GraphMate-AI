import { Router } from 'express';
import {
  getDashboardStats,
  getFriendGrowth,
  getInterestDistribution,
  getPopularSkills,
  getNetworkMetrics,
} from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/friend-growth', getFriendGrowth);
router.get('/interests', getInterestDistribution);
router.get('/skills', getPopularSkills);
router.get('/network', getNetworkMetrics);

export default router;
