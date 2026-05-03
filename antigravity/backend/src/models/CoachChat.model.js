import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const coachChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // One continuous chat history per user
    },
    messages: [messageSchema]
  },
  {
    timestamps: true,
  }
);

const CoachChat = mongoose.model('CoachChat', coachChatSchema);
export default CoachChat;
