const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const multer = require("multer");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/user", passport.authenticate("session"), async function (req, res, next) {
  res.json({ username: req.user.username });
});

router.get("/user/profile/:username", passport.authenticate("session"), async function (req, res, next) {
  const user = await User.findOne({ username: req.params.username });
  res.json({ username: user.username, description: user.description, profilePictureUrl: user.profilePictureUrl });
});

router.get("/user/profile", passport.authenticate("session"), async function (req, res, next) {
  res.json({ username: req.user.username, description: req.user.description, profilePictureUrl: req.user.profilePictureUrl });
});

router.post("/user/update-profile", passport.authenticate("session"), upload.single("profilePicture"), async (req, res, next) => {
  try {
    let profilePictureUrl = null;
    if (req.file) {
      const userId = req.user._id;
      const filePath = req.file.path;
      profilePictureUrl = await User.uploadProfilePicture(userId, filePath);
    }
    const userWithUsername = await User.findOne({ username: req.body.username });
    console.log(userWithUsername);
    console.log(req.user);
    if (!(userWithUsername._id.equals(req.user._id))) {
      console.log(userWithUsername._id);
      console.log(req.user._id);
      console.log("Problem");
      return res.status(409).json({ error: "Username is taken" });
    }
    const updatedProfile = await User.findByIdAndUpdate({ _id: req.user._id }, req.body);
    res.json({ profilePictureUrl: profilePictureUrl });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
