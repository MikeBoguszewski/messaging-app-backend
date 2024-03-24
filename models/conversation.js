const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [{ type: String }],
  messages: {
    type: [
      {
        sender: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now() },
      },
    ],
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
