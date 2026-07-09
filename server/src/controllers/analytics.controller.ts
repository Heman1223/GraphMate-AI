import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Friendship from '../models/Friendship';
import { AuthRequest } from '../middleware/auth.middleware';
import graphService from '../services/graph.service';

/**
 * GET /api/analytics/dashboard
 */
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;

    const [totalUsers, totalFriendships, myFriendsCount, pendingRequests, user] =
      await Promise.all([
        User.countDocuments(),
        Friendship.countDocuments({ status: 'accepted' }),
        Friendship.countDocuments({
          $or: [
            { requester: userId, status: 'accepted' },
            { recipient: userId, status: 'accepted' },
          ],
        }),
        Friendship.countDocuments({
          recipient: userId,
          status: 'pending',
        }),
        User.findById(userId).lean(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalFriendships,
        friendsCount: myFriendsCount,
        pendingRequests,
        aiMatchAccuracy: 85, // Mock value as placeholder
        profileViews: user?.profileViews || 0,
        memberSince: user?.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/friend-growth
 */
export const getFriendGrowth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const months = parseInt(req.query.months as string) || 6;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const growth = await Friendship.aggregate([
      {
        $match: {
          $or: [{ requester: userId }, { recipient: userId }],
          status: 'accepted',
          updatedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
    ]);

    // Fill in missing months with zero
    const result: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const found = growth.find(
        (g: any) => g.year === year && g.month === month
      );

      result.push({
        date: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        count: found ? found.count : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: { growth: result },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/interests
 */
export const getInterestDistribution = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const distribution = await User.aggregate([
      { $unwind: '$interests' },
      {
        $group: {
          _id: { $toLower: '$interests' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: '$count',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { interests: distribution },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/skills
 */
export const getPopularSkills = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skills = await User.aggregate([
      { $unwind: '$skills' },
      {
        $group: {
          _id: { $toLower: '$skills' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          skill: '$_id',
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/network
 */
export const getNetworkMetrics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id.toString();
    const stats = await graphService.getNetworkStats(userId);

    // College distribution
    const collegeDistribution = await User.aggregate([
      { $match: { college: { $ne: '' } } },
      {
        $group: {
          _id: '$college',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          college: '$_id',
          count: 1,
        },
      },
    ]);

    // City distribution
    const cityDistribution = await User.aggregate([
      { $match: { city: { $ne: '' } } },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          city: '$_id',
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        networkStats: stats,
        collegeDistribution,
        cityDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};
