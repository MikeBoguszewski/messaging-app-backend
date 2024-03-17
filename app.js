require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use("/", authRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
