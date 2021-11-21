import mongoose from "mongoose";
const { Schema } = mongoose;
import config from "../config/main.js";

export const exerciseSchema = new Schema(
  {
    name: {
      type: String,
    },
    equipment: {
      type: String,
      maxLength: [200, "'equipment' max. length is 200, got {VALUE}"],
      trim: true,
    },
    instructions: [
      {
        type: String,
        maxLength: [200, "'instructions' max. length is 200, got {VALUE}"],
        trim: true,
      },
    ],
    files: [
      {
        _id: false,
        path: {
          type: String,
          get: (path) => `${config.env.host}/${path}`,
        },
        displayName: String,
        caption: {
          type: String,
          maxLength: [100, "'caption' max. length is 100, got {VALUE}"],
          trim: true,
        },
      },
    ],
  },
  { timestamps: false },
);
