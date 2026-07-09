import { Router } from 'express';
import { getNetworkData, getNetworkStats } from '../controllers/graph.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/network', getNetworkData);
router.get('/stats', getNetworkStats);

export default router;
