import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getConversations,
  getMessages,
  sendMessage,
} from '../controllers/chat.controller';

const router = Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/messages/:conversationId', getMessages);
router.post('/messages', sendMessage);

export default router;
