import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatDataSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // String or ObjectId, depending on auth
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true, // We'll maintain one document per unique session
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ChatData', chatDataSchema);
