import mongoose from "mongoose";

// Define the ChatMessage schema
const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you're storing user IDs
    ref: "users", // Reference to the User model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false, // Set to false by default for user messages
  },
  adminId: {
    type: String,
    required: true,
  },
  // Add more fields as needed, such as chat room ID or message type
});

// Create a ChatMessage model from the schema

export default mongoose.model("Chat", chatSchema);
