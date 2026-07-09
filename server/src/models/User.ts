import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
}

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

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  college: string;
  branch: string;
  graduationYear: number;
  city: string;
  bio: string;
  skills: string[];
  interests: string[];
  profilePicture: string;
  coverBanner: string;
  resumeLink: string;
  careerGoal: string;
  experience: IExperience[];
  projects: IProject[];
  achievements: string[];
  socialLinks: ISocialLinks;
  embedding: number[];
  profileViews: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  avatarUrl: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    branch: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: Number,
      min: [2000, 'Graduation year must be at least 2000'],
      max: [2035, 'Graduation year cannot exceed 2035'],
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverBanner: {
      type: String,
      default: '',
    },
    resumeLink: {
      type: String,
      default: '',
    },
    careerGoal: {
      type: String,
      default: '',
      trim: true,
    },
    experience: {
      type: [
        {
          company: { type: String, required: true },
          role: { type: String, required: true },
          startDate: { type: String },
          endDate: { type: String },
          description: { type: String },
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          name: { type: String, required: true },
          description: { type: String, required: true },
          link: { type: String },
          tags: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    embedding: {
      type: [Number],
      select: false,
    },
    profileViews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search performance
userSchema.index({ name: 'text', username: 'text', skills: 'text', interests: 'text' });
userSchema.index({ college: 1 });
userSchema.index({ city: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ interests: 1 });

// Virtual: avatarUrl
userSchema.virtual('avatarUrl').get(function (this: IUser) {
  if (this.profilePicture && this.profilePicture.length > 0) {
    return this.profilePicture;
  }
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.username || 'user')}`;
});

// Pre-save hook: hash password if modified
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method: compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
