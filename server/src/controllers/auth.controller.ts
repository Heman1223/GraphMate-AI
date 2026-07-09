import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import User from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import aiService from '../services/ai.service';

// Validation rules
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { name, username, email, password, college, branch, graduationYear, city, bio, skills, interests } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      throw new AppError(
        existingUser.email === email.toLowerCase()
          ? 'Email already registered'
          : 'Username already taken',
        400
      );
    }

    // Create user
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      college: college || '',
      branch: branch || '',
      graduationYear: graduationYear || undefined,
      city: city || '',
      bio: bio || '',
      skills: skills || [],
      interests: interests || [],
    });

    // Generate AI embedding asynchronously (don't block registration)
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
        console.warn('⚠️ Failed to generate embedding for new user:', (err as Error).message);
      }
    })();

    const token = generateToken(user._id.toString());

    // Remove password from response
    const userObj = user.toObject();
    delete (userObj as any).password;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: userObj,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id.toString());

    // Remove password from response
    const userObj = user.toObject();
    delete (userObj as any).password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userObj,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (
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
