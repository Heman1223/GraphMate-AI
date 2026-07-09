import { Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

/**
 * GET /api/notifications
 */
export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ user: req.user!._id })
        .populate('relatedUser', 'name username profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ user: req.user!._id }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/:id/read
 */
export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Notification.updateMany(
      { user: req.user!._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/unread-count
 */
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await Notification.countDocuments({
      user: req.user!._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};
