const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: {
    type: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now() },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
