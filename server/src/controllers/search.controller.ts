import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import aiService from '../services/ai.service';

/**
 * GET /api/search?q=query&type=name|skill|interest|college|city|semantic
 */
export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, type = 'name' } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    const query = q.trim();
    let users: any[] = [];

    switch (type) {
      case 'name': {
        users = await User.find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } },
          ],
        })
          .limit(20)
          .lean();
        break;
      }

      case 'skill': {
        users = await User.find({
          skills: { $regex: query, $options: 'i' },
        })
          .limit(20)
          .lean();
        break;
      }

      case 'interest': {
        users = await User.find({
          interests: { $regex: query, $options: 'i' },
        })
          .limit(20)
          .lean();
        break;
      }

      case 'college': {
        users = await User.find({
          college: { $regex: query, $options: 'i' },
        })
          .limit(20)
          .lean();
        break;
      }

      case 'city': {
        users = await User.find({
          city: { $regex: query, $options: 'i' },
        })
          .limit(20)
          .lean();
        break;
      }

      case 'semantic': {
        // Get all users and their profile texts
        const allUsers = await User.find({}).limit(100).lean();

        if (allUsers.length === 0) {
          users = [];
          break;
        }

        const documents = allUsers.map((u) =>
          aiService.buildProfileText({
            name: u.name,
            bio: u.bio,
            skills: u.skills,
            interests: u.interests,
            college: u.college,
            branch: u.branch,
            city: u.city,
          })
        );

        const searchResults = await aiService.semanticSearch(query, documents);

        // Sort by score descending and return top 20
        const sortedResults = searchResults
          .sort((a, b) => b.score - a.score)
          .slice(0, 20);

        users = sortedResults
          .filter((r) => r.score > 0.1) // Filter out very low scores
          .map((r) => ({
            ...allUsers[r.index],
            searchScore: Math.round(r.score * 10000) / 10000,
          }));

        // If semantic search returned no good results, fall back to text search
        if (users.length === 0) {
          users = await User.find({
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { username: { $regex: query, $options: 'i' } },
              { skills: { $regex: query, $options: 'i' } },
              { interests: { $regex: query, $options: 'i' } },
              { college: { $regex: query, $options: 'i' } },
              { city: { $regex: query, $options: 'i' } },
              { bio: { $regex: query, $options: 'i' } },
            ],
          })
            .limit(20)
            .lean();
        }
        break;
      }

      default: {
        // Default: search across all fields
        users = await User.find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } },
            { skills: { $regex: query, $options: 'i' } },
            { interests: { $regex: query, $options: 'i' } },
            { college: { $regex: query, $options: 'i' } },
            { city: { $regex: query, $options: 'i' } },
          ],
        })
          .limit(20)
          .lean();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        users,
        count: users.length,
        query,
        type,
      },
    });
  } catch (error) {
    next(error);
  }
};
