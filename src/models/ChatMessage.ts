import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  conversationId: string;
  sender: 'user' | 'bot' | 'admin';
  message: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
  metadata?: {
    orderId?: string;
    productId?: string;
    category?: string;
  };
}

const ChatMessageSchema: Schema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: String,
      enum: ['user', 'bot', 'admin'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    attachments: [{
      type: String
    }],
    metadata: {
      orderId: String,
      productId: String,
      category: String
    }
  },
  { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
