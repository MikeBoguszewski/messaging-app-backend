const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/user/", async function (req, res, next) {
  const user = await User.findOne({ username: req.body.username });
  res.json({ user: user });
});

module.exports = router;
