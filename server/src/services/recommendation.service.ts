import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Friendship from '../models/Friendship';
import graphService from './graph.service';
import aiService from './ai.service';

export interface Explanation {
  mutualFriends: number;
  commonSkills: string[];
  commonInterests: string[];
  sameCollege: boolean;
  sameCity: boolean;
  jaccardIndex: number;
  adamicAdarIndex: number;
  aiSimilarity: number;
  aiAvailable: boolean;
  aiBasis?: string[];
  finalScore: number;
}

export interface Recommendation {
  user: IUser;
  score: number;
  graphScore: number;
  aiScore: number;
  explanation: Explanation;
}

// Scoring weights
const WEIGHTS = {
  jaccard: 0.2,
  adamicAdar: 0.15,
  mutualFriends: 0.25,
  commonSkills: 0.15,
  commonInterests: 0.1,
  sameCollege: 0.1,
  sameCity: 0.05,
};

const GRAPH_WEIGHT = 0.6;
const AI_WEIGHT = 0.4;

class RecommendationService {
  /**
   * Get top 10 friend recommendations for a user.
   */
  async getRecommendations(userId: string): Promise<Recommendation[]> {
    // 1. Get current user with embedding
    const currentUser = await User.findById(userId).select('+embedding').lean();
    if (!currentUser) throw new Error('User not found');

    // 2. Get existing friend IDs (accepted + pending) to exclude
    const existingFriendships = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: { $in: ['accepted', 'pending'] },
    }).lean();

    const excludeIds = new Set<string>([userId]);
    for (const f of existingFriendships) {
      excludeIds.add(f.requester.toString());
      excludeIds.add(f.recipient.toString());
    }

    // 3. Get all candidate users
    const candidates = await User.find({
      _id: { $nin: Array.from(excludeIds).map((id) => new mongoose.Types.ObjectId(id)) },
    })
      .select('+embedding')
      .lean();

    if (candidates.length === 0) return [];

    // 4. Get current user's friend set for Jaccard/Adamic-Adar
    const myFriends = await graphService.getDirectFriends(userId);
    const myFriendSet = new Set(myFriends);

    // 5. Pre-compute candidate friend sets in batch
    const candidateFriendSets = new Map<string, Set<string>>();
    for (const candidate of candidates) {
      const cId = candidate._id.toString();
      const cFriends = await graphService.getDirectFriends(cId);
      candidateFriendSets.set(cId, new Set(cFriends));
    }

    // 6. Check if source embedding is missing, and try to self-heal
    let sourceEmbedding = currentUser.embedding || [];
    
    const myProfileText = aiService.buildProfileText({
      name: currentUser.name,
      bio: currentUser.bio,
      skills: currentUser.skills,
      interests: currentUser.interests,
      college: currentUser.college,
      branch: currentUser.branch,
      city: currentUser.city,
      careerGoal: currentUser.careerGoal,
      experience: currentUser.experience,
      projects: currentUser.projects,
    });

    if (sourceEmbedding.length === 0) {
      const newEmbedding = await aiService.generateEmbedding(myProfileText);
      if (newEmbedding.length > 0) {
        sourceEmbedding = newEmbedding;
        // Save in background so next time it's fast
        User.findByIdAndUpdate(userId, { embedding: newEmbedding }).exec().catch(console.error);
      }
    }

    const dim = sourceEmbedding.length > 0 ? sourceEmbedding.length : 384; // Fallback to 384 for MiniLM if still missing
    
    const targetEmbeddings = candidates.map((c) => {
      if (c.embedding && c.embedding.length === dim) {
        return c.embedding;
      }
      return new Array(dim).fill(0);
    });

    let aiAvailable = false;
    let aiScores: number[] = [];
    
    if (sourceEmbedding.length > 0) {
      aiScores = await aiService.batchSimilarity(sourceEmbedding, targetEmbeddings);
      // Check if AI actually returned real scores (not all zeros from fallback)
      aiAvailable = aiScores.some((s) => s > 0);
    } else {
      aiScores = candidates.map(() => 0);
    }

    // 7. Score each candidate
    const recommendations: Recommendation[] = [];
    const maxMutualForNormalization = Math.max(
      ...candidates.map((c) => {
        const cFriendSet = candidateFriendSets.get(c._id.toString())!;
        let mutual = 0;
        for (const f of myFriendSet) {
          if (cFriendSet.has(f)) mutual++;
        }
        return mutual;
      }),
      1 // Prevent division by zero
    );

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const candidateId = candidate._id.toString();
      const candidateFriendSet = candidateFriendSets.get(candidateId)!;

      // Jaccard Index
      const jaccardIndex = graphService.jaccardSimilarity(myFriendSet, candidateFriendSet);

      // Mutual friends count
      let mutualFriendsCount = 0;
      for (const f of myFriendSet) {
        if (candidateFriendSet.has(f)) mutualFriendsCount++;
      }
      const normalizedMutual = mutualFriendsCount / maxMutualForNormalization;

      // Adamic-Adar (computed inline to avoid redundant DB calls)
      // We'll use a simplified version using pre-fetched data
      let adamicAdar = 0;
      for (const friend of myFriendSet) {
        if (candidateFriendSet.has(friend)) {
          const friendDegree = (await graphService.getDirectFriends(friend)).length;
          if (friendDegree > 1) {
            adamicAdar += 1 / Math.log(friendDegree);
          } else if (friendDegree === 1) {
            adamicAdar += 1;
          }
        }
      }
      // Normalize adamic-adar (typically small values)
      const normalizedAdamicAdar = Math.min(adamicAdar / 5, 1);

      // Common skills
      const skillResult = graphService.commonItemsScore(
        currentUser.skills || [],
        candidate.skills || []
      );

      // Common interests
      const interestResult = graphService.commonItemsScore(
        currentUser.interests || [],
        candidate.interests || []
      );

      // Same college
      const sameCollege =
        !!currentUser.college &&
        !!candidate.college &&
        currentUser.college.toLowerCase() === candidate.college.toLowerCase();

      // Same city
      const sameCity =
        !!currentUser.city &&
        !!candidate.city &&
        currentUser.city.toLowerCase() === candidate.city.toLowerCase();

      // Weighted graph score
      const graphScore =
        WEIGHTS.jaccard * jaccardIndex +
        WEIGHTS.adamicAdar * normalizedAdamicAdar +
        WEIGHTS.mutualFriends * normalizedMutual +
        WEIGHTS.commonSkills * skillResult.score +
        WEIGHTS.commonInterests * interestResult.score +
        WEIGHTS.sameCollege * (sameCollege ? 1 : 0) +
        WEIGHTS.sameCity * (sameCity ? 1 : 0);

      // AI score & explanation basis
      const aiScore = aiScores[i] || 0;
      let aiBasis: string[] = [];

      if (aiAvailable && aiScore > 0) {
        // Find which candidate skills/interests strongly match the user's profile
        const candidateDocs = [
          ...(candidate.skills || []),
          ...(candidate.interests || []),
        ];
        // Deduplicate
        const uniqueDocs = Array.from(new Set(candidateDocs));
        if (uniqueDocs.length > 0) {
          const searchResults = await aiService.semanticSearch(myProfileText, uniqueDocs);
          aiBasis = searchResults
            .filter((r) => r.score > 0.25)
            .sort((a, b) => b.score - a.score)
            .map((r) => uniqueDocs[r.index])
            .slice(0, 3); // Take top 3 best semantic matches
        }
      }

      // Final score: blend graph + AI, or use graph-only when AI is unavailable
      let finalScore: number;
      if (aiAvailable) {
        finalScore = (GRAPH_WEIGHT * graphScore + AI_WEIGHT * aiScore) * 100;
      } else {
        // AI unavailable: scale graph score to full 0-100 range
        finalScore = graphScore * 100;
      }

      const explanation: Explanation = {
        mutualFriends: mutualFriendsCount,
        commonSkills: skillResult.common,
        commonInterests: interestResult.common,
        sameCollege,
        sameCity,
        jaccardIndex: Math.round(jaccardIndex * 10000) / 10000,
        adamicAdarIndex: Math.round(adamicAdar * 10000) / 10000,
        aiSimilarity: Math.round(aiScore * 10000) / 10000,
        aiAvailable,
        aiBasis,
        finalScore: Math.round(finalScore * 100) / 100,
      };

      // Remove embedding from returned user data
      const { embedding, password, ...userWithoutSensitive } = candidate as any;

      recommendations.push({
        user: userWithoutSensitive as IUser,
        score: Math.round(finalScore * 100) / 100,
        graphScore: Math.round(graphScore * 100 * 100) / 100,
        aiScore: Math.round(aiScore * 100 * 100) / 100,
        explanation,
      });
    }

    // 8. Sort by final score descending, return top 10
    recommendations.sort((a, b) => b.score - a.score);
    return recommendations.slice(0, 10);
  }

  /**
   * Get detailed explanation for a specific recommendation.
   */
  async explainRecommendation(
    userId: string,
    targetId: string
  ): Promise<Explanation> {
    const [currentUser, targetUser] = await Promise.all([
      User.findById(userId).select('+embedding').lean(),
      User.findById(targetId).select('+embedding').lean(),
    ]);

    if (!currentUser || !targetUser) {
      throw new Error('User not found');
    }

    const [myFriends, targetFriends] = await Promise.all([
      graphService.getDirectFriends(userId),
      graphService.getDirectFriends(targetId),
    ]);

    const myFriendSet = new Set(myFriends);
    const targetFriendSet = new Set(targetFriends);

    // Mutual friends
    let mutualFriendsCount = 0;
    for (const f of myFriendSet) {
      if (targetFriendSet.has(f)) mutualFriendsCount++;
    }

    // Jaccard
    const jaccardIndex = graphService.jaccardSimilarity(myFriendSet, targetFriendSet);

    // Adamic-Adar
    const adamicAdar = await graphService.adamicAdarIndex(userId, targetId);

    // Skills & interests
    const skillResult = graphService.commonItemsScore(
      currentUser.skills || [],
      targetUser.skills || []
    );
    const interestResult = graphService.commonItemsScore(
      currentUser.interests || [],
      targetUser.interests || []
    );

    // Same college / city
    const sameCollege =
      !!currentUser.college &&
      !!targetUser.college &&
      currentUser.college.toLowerCase() === targetUser.college.toLowerCase();
    const sameCity =
      !!currentUser.city &&
      !!targetUser.city &&
      currentUser.city.toLowerCase() === targetUser.city.toLowerCase();

    // AI similarity
    let aiSimilarity = 0;
    if (
      currentUser.embedding &&
      currentUser.embedding.length > 0 &&
      targetUser.embedding &&
      targetUser.embedding.length > 0
    ) {
      aiSimilarity = await aiService.computeSimilarity(
        currentUser.embedding,
        targetUser.embedding
      );
    }

    // Graph score
    const maxMutual = Math.max(mutualFriendsCount, 1);
    const normalizedMutual = mutualFriendsCount / maxMutual;
    const normalizedAdamicAdar = Math.min(adamicAdar / 5, 1);

    const graphScore =
      WEIGHTS.jaccard * jaccardIndex +
      WEIGHTS.adamicAdar * normalizedAdamicAdar +
      WEIGHTS.mutualFriends * normalizedMutual +
      WEIGHTS.commonSkills * skillResult.score +
      WEIGHTS.commonInterests * interestResult.score +
      WEIGHTS.sameCollege * (sameCollege ? 1 : 0) +
      WEIGHTS.sameCity * (sameCity ? 1 : 0);

    const aiAvailable = aiSimilarity > 0;
    let aiBasis: string[] = [];
    if (aiAvailable) {
      const myProfileText = aiService.buildProfileText({
        name: currentUser.name,
        bio: currentUser.bio,
        skills: currentUser.skills,
        interests: currentUser.interests,
        college: currentUser.college,
        branch: currentUser.branch,
        city: currentUser.city,
        careerGoal: currentUser.careerGoal,
        experience: currentUser.experience,
        projects: currentUser.projects,
      });
      const candidateDocs = [
        ...(targetUser.skills || []),
        ...(targetUser.interests || []),
      ];
      const uniqueDocs = Array.from(new Set(candidateDocs));
      if (uniqueDocs.length > 0) {
        const searchResults = await aiService.semanticSearch(myProfileText, uniqueDocs);
        aiBasis = searchResults
          .filter((r) => r.score > 0.25)
          .sort((a, b) => b.score - a.score)
          .map((r) => uniqueDocs[r.index])
          .slice(0, 3);
      }
    }

    let finalScore: number;
    if (aiAvailable) {
      finalScore = (GRAPH_WEIGHT * graphScore + AI_WEIGHT * aiSimilarity) * 100;
    } else {
      finalScore = graphScore * 100;
    }

    return {
      mutualFriends: mutualFriendsCount,
      commonSkills: skillResult.common,
      commonInterests: interestResult.common,
      sameCollege,
      sameCity,
      jaccardIndex: Math.round(jaccardIndex * 10000) / 10000,
      adamicAdarIndex: Math.round(adamicAdar * 10000) / 10000,
      aiSimilarity: Math.round(aiSimilarity * 10000) / 10000,
      aiAvailable,
      aiBasis,
      finalScore: Math.round(finalScore * 100) / 100,
    };
  }
}

const recommendationService = new RecommendationService();
export default recommendationService;
