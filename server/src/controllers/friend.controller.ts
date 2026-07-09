import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Friendship from '../models/Friendship';
import Notification from '../models/Notification';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import graphService from '../services/graph.service';

/**
 * POST /api/friends/request/:userId
 */
export const sendFriendRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requesterId = req.user!._id.toString();
    const recipientId = req.params.userId as string;

    if (requesterId === recipientId) {
      throw new AppError('You cannot send a friend request to yourself', 400);
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      throw new AppError('User not found', 404);
    }

    // Check for existing friendship in either direction
    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        throw new AppError('You are already friends with this user', 400);
      }
      if (existingFriendship.status === 'pending') {
        throw new AppError('A friend request already exists between you and this user', 400);
      }
      if (existingFriendship.status === 'rejected') {
        // Allow re-requesting after rejection
        existingFriendship.status = 'pending';
        existingFriendship.requester = new mongoose.Types.ObjectId(requesterId);
        existingFriendship.recipient = new mongoose.Types.ObjectId(recipientId);
        await existingFriendship.save();

        // Create notification
        await Notification.create({
          user: recipientId,
          type: 'friend_request',
          message: `${req.user!.name} sent you a friend request`,
          relatedUser: requesterId,
        });

        res.status(200).json({
          success: true,
          message: 'Friend request sent',
          data: { friendship: existingFriendship },
        });
        return;
      }
    }

    // Create new friendship
    const friendship = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending',
    });

    // Create notification for recipient
    await Notification.create({
      user: recipientId,
      type: 'friend_request',
      message: `${req.user!.name} sent you a friend request`,
      relatedUser: requesterId,
    });

    res.status(201).json({
      success: true,
      message: 'Friend request sent',
      data: { friendship },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/friends/accept/:friendshipId
 */
export const acceptFriendRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const friendship = await Friendship.findById(req.params.friendshipId);

    if (!friendship) {
      throw new AppError('Friend request not found', 404);
    }

    // Only recipient can accept
    if (friendship.recipient.toString() !== req.user!._id.toString()) {
      throw new AppError('You can only accept requests sent to you', 403);
    }

    if (friendship.status !== 'pending') {
      throw new AppError(`This request has already been ${friendship.status}`, 400);
    }

    friendship.status = 'accepted';
    await friendship.save();

    // Notify the requester
    await Notification.create({
      user: friendship.requester,
      type: 'request_accepted',
      message: `${req.user!.name} accepted your friend request`,
      relatedUser: req.user!._id,
    });

    res.status(200).json({
      success: true,
      message: 'Friend request accepted',
      data: { friendship },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/friends/reject/:friendshipId
 */
export const rejectFriendRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const friendship = await Friendship.findById(req.params.friendshipId);

    if (!friendship) {
      throw new AppError('Friend request not found', 404);
    }

    // Only recipient can reject
    if (friendship.recipient.toString() !== req.user!._id.toString()) {
      throw new AppError('You can only reject requests sent to you', 403);
    }

    if (friendship.status !== 'pending') {
      throw new AppError(`This request has already been ${friendship.status}`, 400);
    }

    friendship.status = 'rejected';
    await friendship.save();

    res.status(200).json({
      success: true,
      message: 'Friend request rejected',
      data: { friendship },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/friends
 */
export const getFriends = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;

    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' },
      ],
    })
      .populate('requester', 'name username email profilePicture college branch city bio skills interests')
      .populate('recipient', 'name username email profilePicture college branch city bio skills interests')
      .sort({ updatedAt: -1 });

    // Extract the friend (the other user in the friendship)
    const friends = friendships.map((f) => {
      const friend =
        f.requester._id.toString() === userId.toString()
          ? f.recipient
          : f.requester;
      return {
        friendshipId: f._id,
        user: friend,
        since: f.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        friends,
        count: friends.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/friends/requests
 */
export const getPendingRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requests = await Friendship.find({
      recipient: req.user!._id,
      status: 'pending',
    })
      .populate('requester', 'name username email profilePicture college branch city bio skills interests')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        requests,
        count: requests.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/friends/sent
 */
export const getSentRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requests = await Friendship.find({
      requester: req.user!._id,
      status: 'pending',
    })
      .populate('recipient', 'name username email profilePicture college branch city bio skills interests')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        requests,
        count: requests.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/friends/mutual/:userId
 */
export const getMutualFriends = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUserId = req.user!._id.toString();
    const targetUserId = req.params.userId as string;

    const mutualFriends = await graphService.getMutualFriends(
      currentUserId,
      targetUserId
    );

    res.status(200).json({
      success: true,
      data: {
        mutualFriends,
        count: mutualFriends.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/friends/:friendshipId
 */
export const unfriend = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const friendship = await Friendship.findById(req.params.friendshipId);

    if (!friendship) {
      throw new AppError('Friendship not found', 404);
    }

    const userId = req.user!._id.toString();
    if (
      friendship.requester.toString() !== userId &&
      friendship.recipient.toString() !== userId
    ) {
      throw new AppError('You are not part of this friendship', 403);
    }

    await Friendship.findByIdAndDelete(req.params.friendshipId);

    res.status(200).json({
      success: true,
      message: 'Unfriended successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/friends/status/:userId
 */
export const getFriendshipStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUserId = req.user!._id.toString();
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      res.status(200).json({
        success: true,
        data: { status: 'self', friendship: null },
      });
      return;
    }

    const friendship = await Friendship.findOne({
      $or: [
        { requester: currentUserId, recipient: targetUserId },
        { requester: targetUserId, recipient: currentUserId },
      ],
    });

    if (!friendship) {
      res.status(200).json({
        success: true,
        data: { status: 'none', friendship: null },
      });
      return;
    }

    let status = friendship.status;
    let direction = '';

    if (friendship.status === 'pending') {
      direction =
        friendship.requester.toString() === currentUserId ? 'outgoing' : 'incoming';
    }

    res.status(200).json({
      success: true,
      data: {
        status,
        direction,
        friendship,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/friends/count
 */
export const getFriendsCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;

    const count = await Friendship.countDocuments({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' },
      ],
    });

    const pendingCount = await Friendship.countDocuments({
      recipient: userId,
      status: 'pending',
    });

    res.status(200).json({
      success: true,
      data: {
        friendsCount: count,
        pendingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
