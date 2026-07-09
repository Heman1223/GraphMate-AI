import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommunityMessage extends Document {
  _id: mongoose.Types.ObjectId;
  community: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'code';
  emojiReactions: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const communityMessageSchema = new Schema<ICommunityMessage>(
  {
    community: {
      type: Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'code'],
      default: 'text',
    },
    emojiReactions: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

communityMessageSchema.index({ community: 1, createdAt: -1 });

const CommunityMessage: Model<ICommunityMessage> = mongoose.model<ICommunityMessage>(
  'CommunityMessage',
  communityMessageSchema
);
export default CommunityMessage;
