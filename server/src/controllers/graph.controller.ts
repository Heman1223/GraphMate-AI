import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import graphService from '../services/graph.service';

/**
 * GET /api/graph/network
 */
export const getNetworkData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id.toString();
    const networkData = await graphService.getNetworkData(userId);

    res.status(200).json({
      success: true,
      data: networkData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/graph/stats
 */
export const getNetworkStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id.toString();
    const stats = await graphService.getNetworkStats(userId);

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};
