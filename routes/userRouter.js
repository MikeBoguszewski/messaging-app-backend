const express = require("express");
const User = require("../models/user");
const passport = require("passport");

const router = express.Router();

router.get("/user", passport.authenticate("session"), async function (req, res, next) {
  res.json({ username: req.user.username });
});

router.get("/users", passport.authenticate("session"), async function (req, res, next) {
  const users = await User.find();
  const formattedUsers = users
    .filter((user) => user.username !== req.user.username)
    .map((user) => ({
      _id: user._id,
      username: user.username,
      profilePictureURL: user.profile_picture_Url,
    }));
  res.json({ formattedUsers: formattedUsers });
});

module.exports = router;
