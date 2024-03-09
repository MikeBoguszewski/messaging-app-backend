const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile_picture_Url: { type: String },
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

userSchema.statics.uploadProfilePicture = async function (userId, filePath) {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    const updatedUser = await this.findByIdAndUpdate(userId, { profilePictureUrl: uploadResult.secure_url }, { new: true });
    return updatedUser.profilePictureUrl;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);
