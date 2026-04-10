import ChatData from '../models/chatData.model.js';
import { processAndStorePDF, generateChatResponse } from '../services/RAG.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Upload PDF, chunk it, and store embeddings in Pinecone
 * @route   POST /api/rag/uploadpdf
 * @access  Public
 */
export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file provided.' });
    }

    const userId = req.body.userId || 'anonymous_user';
    const sessionId = req.body.sessionId || uuidv4();
    const language = req.body.language || 'en';

    // Process using RAG service
    const result = await processAndStorePDF(req.file.buffer, userId, sessionId);

    // Auto-generate summary
    const summaryPrompt = "Generate a brief summary of the soil report you just received. Provide key takeaways regarding nutrient deficiencies and general soil health.";
    const aiResponse = await generateChatResponse(userId, sessionId, summaryPrompt, [], language);

    // Save summary to chat history
    let chatData = await ChatData.findOne({ sessionId });
    if (!chatData) {
      chatData = new ChatData({ userId, sessionId, messages: [] });
    }
    chatData.messages.push({ role: 'ai', content: aiResponse });
    await chatData.save();

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        chunksProcessed: result.chunksProcessed,
        message: 'PDF analyzed contextually successfully.',
      },
    });
  } catch (error) {
    console.error('[rag.controller] uploadPDF error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Chat with the RAG system
 * @route   POST /api/rag/chat
 * @access  Public
 */
export const chat = async (req, res) => {
  try {
    const { userId = 'anonymous_user', sessionId, message, language = 'en' } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ success: false, message: 'sessionId and message are required.' });
    }

    // 1. Fetch existing chat history from MongoDB
    let chatData = await ChatData.findOne({ sessionId });

    if (!chatData) {
      // Create new session if none exists
      chatData = new ChatData({ userId, sessionId, messages: [] });
    }

    // Prepare history array for the service
    const previousMessages = chatData.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // 2. Add current user message to Mongo document temporarily to save it later
    chatData.messages.push({ role: 'user', content: message });

    // 3. Generate response using LangChain and Pinecone context
    const aiResponse = await generateChatResponse(userId, sessionId, message, previousMessages, language);

    // 4. Save AI's response to Mongo
    chatData.messages.push({ role: 'ai', content: aiResponse });
    await chatData.save();

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
      },
    });
  } catch (error) {
    console.error('[rag.controller] chat error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Retrieve chat history
 * @route   GET /api/rag/history/:userId/:sessionId
 * @access  Public
 */
export const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const chatData = await ChatData.findOne({ sessionId });

    if (!chatData) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({
      success: true,
      data: chatData.messages,
    });
  } catch (error) {
    console.error('[rag.controller] getHistory error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
