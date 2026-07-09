import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDirectMessage extends Document {
  _id: mongoose.Types.ObjectId;
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'code';
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const directMessageSchema = new Schema<IDirectMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
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
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

directMessageSchema.index({ conversation: 1, createdAt: 1 });
directMessageSchema.index({ receiver: 1, read: 1 });

const DirectMessage: Model<IDirectMessage> = mongoose.model<IDirectMessage>(
  'DirectMessage',
  directMessageSchema
);
export default DirectMessage;
