import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommunity extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: 'global' | 'network';
  description: string;
  avatar: string;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const communitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ['global', 'network'],
      default: 'global',
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
    },
    avatar: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

communitySchema.index({ name: 'text', description: 'text' });

const Community: Model<ICommunity> = mongoose.model<ICommunity>('Community', communitySchema);
export default Community;
