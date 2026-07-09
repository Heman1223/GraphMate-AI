import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import recommendationService from '../services/recommendation.service';

/**
 * GET /api/recommendations
 */
export const getRecommendations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id.toString();
    const recommendations = await recommendationService.getRecommendations(userId);

    res.status(200).json({
      success: true,
      data: {
        recommendations,
        count: recommendations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/recommendations/explain/:userId
 */
export const explainRecommendation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUserId = req.user!._id.toString();
    const targetUserId = req.params.userId as string;

    const explanation = await recommendationService.explainRecommendation(
      currentUserId,
      targetUserId
    );

    res.status(200).json({
      success: true,
      data: { explanation },
    });
  } catch (error) {
    next(error);
  }
};
