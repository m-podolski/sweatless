import { Schema } from "mongoose";

interface Log {
  date: Date;
  duration: number;
  training: string;
  results: string;
  notes: string;
}

const logSchema = new Schema<Log>(
  {
    date: {
      type: Date,
      trim: true,
      default: Date.now,
    },
    duration: {
      type: Number,
      trim: true,
    },
    training: {
      type: String,
      trim: true,
      required: [true, "'training' is required"],
    },
    results: {
      type: String,
      required: [true, "'results' is required"],
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [250, "'notes' max. length is 250, got {VALUE}"],
    },
  },
  { timestamps: false },
);

export { Log, logSchema };
