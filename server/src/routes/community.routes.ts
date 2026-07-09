import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getCommunities,
  getMyCommunities,
  createCommunity,
  joinCommunity,
  getCommunityMessages,
  sendCommunityMessage,
} from '../controllers/community.controller';

const router = Router();

router.use(protect);

router.get('/', getCommunities);
router.get('/my', getMyCommunities);
router.post('/', createCommunity);
router.post('/:communityId/join', joinCommunity);
router.get('/:communityId/messages', getCommunityMessages);
router.post('/messages', sendCommunityMessage);

export default router;
