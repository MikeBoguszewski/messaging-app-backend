const express = require("express");
const Conversation = require("../models/conversation");
const passport = require("passport");

const router = express.Router();

router.get("/conversation/:conversationId", passport.authenticate("session"), async function (req, res, next) {
  const conversation = await Conversation.findOne({ _id: req.params.conversationId });
  res.json({ conversation: conversation });
});

router.get("/conversation", passport.authenticate("session"), async function (req, res, next) {
  const user = req.user.username;
  const conversations = await Conversation.find({ participants: user }).populate("participants messages.sender");
  res.json({ conversations: conversations });
});

router.post(
  "/conversation/:conversationId",
  passport.authenticate("session"), async function (req, res, next) {
    try {
      const updatedConversation = await Conversation.findOneAndUpdate({ _id: req.params.conversationId }, { $push: { messages: req.body } });
      if (!updatedConversation) {
        res.status(404).json({ error: "Conversation not found" });
      }
      res.json({ updatedConversation: updatedConversation });
    } catch (error) {
      console.error("Error updating conversation", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.post("/conversation", passport.authenticate("session"), async function (req, res, next) {
  const { otherParticipant } = req.body;
  const newConversation = new Conversation({ participants: [req.user.username, otherParticipant] });
  await newConversation.save();
  res.json({ newConversation: newConversation });
});


module.exports = router;
