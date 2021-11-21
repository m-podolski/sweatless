import mongoose from "mongoose";

const { Schema } = mongoose;

export const logSchema = new Schema(
  {
    Date: {
      type: Date,
      trim: true,
      default: Date.now(),
    },
    Duration: {
      type: Number,
      trim: true,
    },
    Training: {
      type: String,
      trim: true,
      required: [true, "'Training' is required"],
    },
    Results: {
      type: String,
      required: [true, "'Results' is required"],
    },
    Notes: {
      type: String,
      trim: true,
      maxLength: [250, "'Notes' max. length is 250, got {VALUE}"],
    },
  },
  { timestamps: false },
);
