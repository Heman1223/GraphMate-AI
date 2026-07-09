import { Router } from 'express';
import {
  getRecommendations,
  explainRecommendation,
} from '../controllers/recommendation.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getRecommendations);
router.get('/explain/:userId', explainRecommendation);

export default router;
