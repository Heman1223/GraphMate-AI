import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import Community from '../models/Community';
import CommunityMessage from '../models/CommunityMessage';

export const getCommunities = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const type = req.query.type as string;
    const filter = type ? { type } : {};
    
    const communities = await Community.find(filter)
      .populate('createdBy', 'name username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { communities } });
  } catch (error) {
    next(error);
  }
};

export const getMyCommunities = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const communities = await Community.find({ members: userId })
      .populate('createdBy', 'name username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { communities } });
  } catch (error) {
    next(error);
  }
};

export const createCommunity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, type = 'global', avatar } = req.body;
    const createdBy = req.user!._id;

    const community = await Community.create({
      name,
      description,
      type,
      avatar,
      createdBy,
      members: [createdBy]
    });

    res.status(201).json({ success: true, data: { community } });
  } catch (error) {
    next(error);
  }
};

export const joinCommunity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { communityId } = req.params;
    const userId = req.user!._id;

    const community = await Community.findByIdAndUpdate(
      communityId,
      { $addToSet: { members: userId } },
      { new: true }
    );

    if (!community) {
      throw new AppError('Community not found', 404);
    }

    res.status(200).json({ success: true, message: 'Joined community', data: { community } });
  } catch (error) {
    next(error);
  }
};

export const getCommunityMessages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { communityId } = req.params;
    const messages = await CommunityMessage.find({ community: communityId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name username profilePicture');

    res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
};

export const sendCommunityMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { communityId, content, type = 'text' } = req.body;
    const senderId = req.user!._id;

    const message = await CommunityMessage.create({
      community: communityId,
      sender: senderId,
      content,
      type
    });

    const populatedMessage = await message.populate('sender', 'name username profilePicture');

    res.status(201).json({ success: true, data: { message: populatedMessage } });
  } catch (error) {
    next(error);
  }
};
