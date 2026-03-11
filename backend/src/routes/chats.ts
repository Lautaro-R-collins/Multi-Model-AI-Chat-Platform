import express, { type Response } from 'express';
import Chat from '../models/Chat.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all chats for a user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const chats = await Chat.find({ userId: new mongoose.Types.ObjectId(userId as string) }).sort({ timestamp: -1 });
    res.json(chats);
  } catch (error) {
    console.error('Fetch chats error:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// Create a new chat
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { title, messages, model } = req.body;
    const newChat = new Chat({
      userId: new mongoose.Types.ObjectId(userId as string),
      title,
      messages,
      aiModel: model,
      timestamp: Date.now(),
    });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(400).json({ message: 'Error creating chat' });
  }
});

// Update a chat (sync messages)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { messages, title } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id as string), userId: new mongoose.Types.ObjectId(userId as string) },
      { messages, title },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(400).json({ message: 'Error updating chat' });
  }
});

// Delete a chat
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const chat = await Chat.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(req.params.id as string), 
      userId: new mongoose.Types.ObjectId(userId as string) 
    });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Error deleting chat' });
  }
});

export default router;
