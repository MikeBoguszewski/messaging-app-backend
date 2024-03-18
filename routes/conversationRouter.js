const express = require("express");
const Conversation = require("../models/conversation");

const router = express.Router();

router.get("/conversation/", async function (req, res, next) {
  const conversations = await Conversation.find({ participants: req.user._id }).populate("participants messages.sender");
  res.json({ conversations: conversations });
});

router.post("/conversation/", function (req, res, next) {
  const { participants } = req.body;
  const newConversation = new Conversation({ participants: participants });
  newConversation.save();
  res.json({ newConversation: newConversation });
});

module.exports = router;
