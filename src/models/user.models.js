/*
id string PK
username string
email string
fullname string
avatar string
coverImage string
watchHistory ObjectId[] videos
password string 
refreshToken string
createdAt Date
updatedAt Date

*/

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// create database schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary image
      required: true,
    },
    coverImage: {
      type: String, // cloudinary image
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video", // that is ref from video.models.js
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// here we save encrypted password to database and if password modified, it will again encrypt password and save in database
// it use pre middleware function that work before save the password in database
//if current middleware not respond then next() use for pass it to next middleware
userSchema.pre("save", async function (next) {
  if (!this.modified("password")) return next();
  this.password = bcrypt.hash("password", 10);
  next();
});

// here we compare both passwords (encrypt password who save in database and password that use by user for login)
// it return a boolean value (true or false)
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// RefreshToken jeson web token
userSchema.methods.generateRefreshToken = function () {
  //short lived access token
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXREFRESH }
  );
};
export const User = mongoose.model("User", userSchema);
