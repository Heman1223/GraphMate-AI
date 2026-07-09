import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationType = 'friend_request' | 'request_accepted' | 'new_recommendation';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  relatedUser: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['friend_request', 'request_accepted', 'new_recommendation'],
        message: 'Type must be friend_request, request_accepted, or new_recommendation',
      },
      required: [true, 'Notification type is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
