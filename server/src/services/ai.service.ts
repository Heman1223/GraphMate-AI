import axios, { AxiosInstance } from 'axios';
import env from '../config/env';

class AIService {
  private client: AxiosInstance;
  private isAvailable: boolean = true;

  constructor() {
    this.client = axios.create({
      baseURL: env.AI_SERVICE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Track availability
    this.client.interceptors.response.use(
      (response) => {
        this.isAvailable = true;
        return response;
      },
      (error) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
          this.isAvailable = false;
          console.warn('⚠️ AI Service unavailable, falling back to graph-only scoring');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Build a text representation of a user profile for embedding generation.
   */
  buildProfileText(profile: {
    name?: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
    college?: string;
    branch?: string;
    city?: string;
    careerGoal?: string;
    experience?: any[];
    projects?: any[];
  }): string {
    const parts: string[] = [];
    if (profile.name) parts.push(`Name: ${profile.name}`);
    if (profile.bio) parts.push(`Bio: ${profile.bio}`);
    if (profile.careerGoal) parts.push(`Career Goal: ${profile.careerGoal}`);
    if (profile.skills && profile.skills.length > 0) {
      parts.push(`Skills: ${profile.skills.join(', ')}`);
    }
    if (profile.interests && profile.interests.length > 0) {
      parts.push(`Interests: ${profile.interests.join(', ')}`);
    }
    if (profile.college) parts.push(`College: ${profile.college}`);
    if (profile.branch) parts.push(`Branch: ${profile.branch}`);
    if (profile.city) parts.push(`City: ${profile.city}`);
    
    if (profile.experience && profile.experience.length > 0) {
      const expStrs = profile.experience.map(e => `${e.role} at ${e.company}`);
      parts.push(`Experience: ${expStrs.join(', ')}`);
    }
    
    if (profile.projects && profile.projects.length > 0) {
      const projStrs = profile.projects.map(p => `${p.name} (${p.description})`);
      parts.push(`Projects: ${projStrs.join(', ')}`);
    }

    return parts.join('. ');
  }

  /**
   * Generate embedding vector for a profile text string.
   */
  async generateEmbedding(profileText: string): Promise<number[]> {
    try {
      const response = await this.client.post('/api/embed', {
        text: profileText,
      });
      return response.data.embedding;
    } catch (error) {
      console.warn('⚠️ Failed to generate embedding:', (error as Error).message);
      return [];
    }
  }

  /**
   * Compute cosine similarity between two embeddings.
   */
  async computeSimilarity(
    embedding1: number[],
    embedding2: number[]
  ): Promise<number> {
    try {
      if (!embedding1.length || !embedding2.length) return 0;

      const response = await this.client.post('/api/similarity', {
        embedding1,
        embedding2,
      });
      return response.data.similarity;
    } catch (error) {
      console.warn('⚠️ Failed to compute similarity:', (error as Error).message);
      return 0;
    }
  }

  /**
   * Batch compute similarity between a source embedding and multiple target embeddings.
   */
  async batchSimilarity(
    sourceEmbedding: number[],
    targetEmbeddings: number[][]
  ): Promise<number[]> {
    try {
      if (!sourceEmbedding.length || targetEmbeddings.length === 0) {
        return targetEmbeddings.map(() => 0);
      }

      const response = await this.client.post('/api/batch-similarity', {
        source_embedding: sourceEmbedding,
        target_embeddings: targetEmbeddings,
      });
      return response.data.similarities;
    } catch (error) {
      console.warn('⚠️ Failed to compute batch similarity:', (error as Error).message);
      // Return zeros when AI service is unavailable
      return targetEmbeddings.map(() => 0);
    }
  }

  /**
   * Semantic search: rank documents by relevance to a query.
   */
  async semanticSearch(
    query: string,
    documents: string[]
  ): Promise<{ index: number; score: number }[]> {
    try {
      if (documents.length === 0) return [];

      const response = await this.client.post('/api/semantic-search', {
        query,
        documents,
      });
      return response.data.results;
    } catch (error) {
      console.warn('⚠️ Failed to perform semantic search:', (error as Error).message);
      // Fallback: return all with 0 scores
      return documents.map((_, index) => ({ index, score: 0 }));
    }
  }

  /**
   * Check if the AI service is currently available.
   */
  async checkHealth(): Promise<boolean> {
    try {
      await this.client.get('/health');
      this.isAvailable = true;
      return true;
    } catch {
      this.isAvailable = false;
      return false;
    }
  }

  getAvailability(): boolean {
    return this.isAvailable;
  }
}

const aiService = new AIService();
export default aiService;
