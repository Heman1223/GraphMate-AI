import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import Conversation from '../models/Conversation';
import DirectMessage from '../models/DirectMessage';

export const getConversations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name username profilePicture')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: { conversations } });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const messages = await DirectMessage.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name username profilePicture');

    // Mark as read
    await DirectMessage.updateMany(
      { conversation: conversationId, receiver: req.user!._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { receiverId, content, type = 'text' } = req.body;
    const senderId = req.user!._id;

    if (!receiverId || !content) {
      throw new AppError('Receiver and content are required', 400);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const message = await DirectMessage.create({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content,
      type
    });

    conversation.lastMessage = message._id as any;
    conversation.updatedAt = new Date();
    await conversation.save();

    const populatedMessage = await message.populate('sender', 'name username profilePicture');

    res.status(201).json({ success: true, data: { message: populatedMessage } });
  } catch (error) {
    next(error);
  }
};
