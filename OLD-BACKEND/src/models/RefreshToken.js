import mongoose from "mongoose";
import config from "../config/main.js";

const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: [true, "'token' is required"],
    },
    expires: {
      type: Date,
      required: [true, "'expires' is required"],
      default: Date.now(),
    },
    sub: {
      type: String,
      required: [true, "'sub' is required"],
    },
    role: {
      type: String,
      required: [true, "'role' is required"],
    },
  },
  { timestamps: true },
);

refreshTokenSchema.index(
  { expires: 1 },
  { expireAfterSeconds: config.auth.refreshTokenExpMS / 1000 },
);

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
