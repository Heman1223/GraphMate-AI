import mongoose, { Schema, Document, Model } from 'mongoose';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';

export interface IFriendship extends Document {
  _id: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: FriendshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

const friendshipSchema = new Schema<IFriendship>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required'],
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected'],
        message: 'Status must be pending, accepted, or rejected',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: unique pair
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendshipSchema.index({ status: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });
friendshipSchema.index({ requester: 1, status: 1 });

const Friendship: Model<IFriendship> = mongoose.model<IFriendship>('Friendship', friendshipSchema);

export default Friendship;
