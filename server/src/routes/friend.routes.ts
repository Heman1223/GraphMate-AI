import { Router } from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getPendingRequests,
  getSentRequests,
  getMutualFriends,
  unfriend,
  getFriendshipStatus,
  getFriendsCount,
} from '../controllers/friend.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All friend routes require authentication
router.use(protect);

router.get('/', getFriends);
router.get('/requests', getPendingRequests);
router.get('/sent', getSentRequests);
router.get('/count', getFriendsCount);
router.get('/status/:userId', getFriendshipStatus);
router.get('/mutual/:userId', getMutualFriends);
router.post('/request/:userId', sendFriendRequest);
router.put('/accept/:friendshipId', acceptFriendRequest);
router.put('/reject/:friendshipId', rejectFriendRequest);
router.delete('/:friendshipId', unfriend);

export default router;
