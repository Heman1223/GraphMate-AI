import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import aiService from '../services/ai.service';

/**
 * GET /api/users/profile
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allowedFields = [
      'name',
      'bio',
      'college',
      'branch',
      'graduationYear',
      'city',
      'skills',
      'interests',
      'socialLinks',
      'profilePicture',
    ];

    const updates: any = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user!._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Regenerate AI embedding with updated profile
    (async () => {
      try {
        const profileText = aiService.buildProfileText({
          name: user.name,
          bio: user.bio,
          skills: user.skills,
          interests: user.interests,
          college: user.college,
          branch: user.branch,
          city: user.city,
        });
        const embedding = await aiService.generateEmbedding(profileText);
        if (embedding.length > 0) {
          await User.findByIdAndUpdate(user._id, { embedding });
        }
      } catch (err) {
        console.warn('⚠️ Failed to regenerate embedding:', (err as Error).message);
      }
    })();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { profileViews: 1 } },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/username/:username
 */
export const getUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOne({
      username: (req.params.username as string).toLowerCase(),
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/upload-avatar
 */
export const uploadAvatar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const profilePicture = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { profilePicture },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        profilePicture,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
