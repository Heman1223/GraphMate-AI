// ===== User Types =====
export interface IExperience {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface IProject {
  name: string;
  description: string;
  link?: string;
  tags?: string[];
}

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: number;
  city: string;
  bio: string;
  skills: string[];
  interests: string[];
  profilePicture: string;
  avatarUrl: string;
  coverBanner: string;
  resumeLink: string;
  careerGoal: string;
  experience: IExperience[];
  projects: IProject[];
  achievements: string[];
  socialLinks: {
    github: string;
    linkedin: string;
  };
  profileViews: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUserUpdate {
  name?: string;
  username?: string;
  college?: string;
  branch?: string;
  graduationYear?: number;
  city?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  profilePicture?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
  };
}

// ===== Auth Types =====
export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  college?: string;
  branch?: string;
  graduationYear?: number;
  city?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

// ===== Friendship Types =====
export interface IFriendship {
  _id: string;
  requester: IUser;
  recipient: IUser;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface IFriendStatus {
  status: 'none' | 'pending_sent' | 'pending_received' | 'accepted';
  friendshipId?: string;
}

// ===== Recommendation Types =====
export interface IRecommendation {
  user: IUser;
  score: number;
  graphScore: number;
  aiScore: number;
  explanation: IExplanation;
}

export interface IExplanation {
  mutualFriends: number;
  mutualFriendsList?: IUser[];
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

// ===== Notification Types =====
export interface INotification {
  _id: string;
  user: string;
  type: 'friend_request' | 'request_accepted' | 'new_recommendation';
  message: string;
  relatedUser: IUser;
  read: boolean;
  createdAt: string;
}

// ===== Graph Types =====
export interface IGraphNode {
  id: string;
  label: string;
  avatar: string;
  type: 'self' | 'friend' | 'mutual' | 'suggested';
}

export interface IGraphEdge {
  source: string;
  target: string;
  type: 'friend' | 'mutual' | 'suggested';
}

export interface INetworkData {
  nodes: IGraphNode[];
  edges: IGraphEdge[];
}

export interface INetworkStats {
  totalNodes: number;
  totalEdges: number;
  density: number;
  averageDegree: number;
  clusteringCoefficient: number;
}

// ===== Analytics Types =====
export interface IDashboardStats {
  friendsCount: number;
  pendingRequests: number;
  aiMatchAccuracy: number;
  profileViews: number;
}

export interface IFriendGrowth {
  date: string;
  count: number;
}

export interface IInterestDistribution {
  name: string;
  value: number;
}

export interface ISkillPopularity {
  skill: string;
  count: number;
}

// ===== Search Types =====
export interface ISearchParams {
  q: string;
  type: 'name' | 'skill' | 'interest' | 'college' | 'city' | 'semantic';
}

// ===== API Response =====
export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== Theme =====
export type Theme = 'light' | 'dark' | 'system';

export interface ICommunity {
  _id: string;
  name: string;
  type: 'global' | 'network';
  description: string;
  avatar: string;
  createdBy: IUser | string;
  members: string[];
  createdAt: string;
}

export interface ICommunityMessage {
  _id: string;
  community: string;
  sender: IUser;
  content: string;
  type: 'text' | 'image' | 'code';
  createdAt: string;
}

export interface IConversation {
  _id: string;
  participants: IUser[];
  lastMessage?: IDirectMessage;
  updatedAt: string;
}

export interface IDirectMessage {
  _id: string;
  conversation: string;
  sender: IUser | string;
  receiver: IUser | string;
  content: string;
  type: 'text' | 'image' | 'code';
  read: boolean;
  createdAt: string;
}
