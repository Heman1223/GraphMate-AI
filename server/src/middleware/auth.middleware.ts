import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import env from '../config/env';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.',
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Not authorized. User no longer exists.',
        });
        return;
      }

      req.user = user;
      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        message: 'Not authorized. Token is invalid or expired.',
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};
