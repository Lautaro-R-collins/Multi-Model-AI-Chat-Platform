import mongoose, { Schema, type Document } from 'mongoose';

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
  }>;
  aiModel: string;
  timestamp: number;
}

const ChatSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Number, required: true },
    },
  ],
  aiModel: { type: String, required: true },
  timestamp: { type: Number, default: Date.now },
});

export default mongoose.model<IChat>('Chat', ChatSchema);
