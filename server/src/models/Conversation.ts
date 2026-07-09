import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'DirectMessage',
    },
  },
  { timestamps: true }
);

// Ensure query performance when finding conversations for a user
conversationSchema.index({ participants: 1, updatedAt: -1 });

const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  'Conversation',
  conversationSchema
);
export default Conversation;
