const express = require("express");
const Conversation = require("../models/conversation");
const passport = require("passport");

const router = express.Router();

router.get("/conversation", passport.authenticate("session"), async function (req, res, next) {
  const user = req.user.username;
  const conversations = await Conversation.find({ participants: user }).populate("participants messages.sender");
  res.json({ conversations: conversations });
});

router.post("/conversation", passport.authenticate("session"), function (req, res, next) {
  const { otherParticipants } = req.body;
  const newConversation = new Conversation({ participants: [req.user.username, ...otherParticipants] });
  newConversation.save();
  res.json({ newConversation: newConversation });
});

module.exports = router;
