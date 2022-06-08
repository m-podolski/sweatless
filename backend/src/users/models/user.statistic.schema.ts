import { Schema } from "mongoose";

interface Statistic {
  totals: {
    label: string;
    unit: string;
    total: number;
    fields: { label: string; unit: string; total: number }[];
  }[];
  proportions: {
    label: string;
    count: number;
    percent: number;
    cumulated: number;
  }[];
  timeline: { name: string; date: string }[];
  months: {
    data: { name: string; total: number; fields: number[] }[];
    keys: string[];
    unit: string;
  };
}

const statisticSchema = new Schema<Statistic>(
  {
    totals: [
      {
        _id: false,
        label: String,
        unit: String,
        total: Number,
        fields: [{ _id: false, label: String, unit: String, total: Number }],
      },
    ],
    proportions: [
      {
        _id: false,
        label: String,
        count: Number,
        percent: Number,
        cumulated: Number,
      },
    ],
    timeline: [{ _id: false, name: String, date: String }],
    months: {
      data: [{ _id: false, name: String, total: Number, fields: [Number] }],
      keys: [String],
      unit: String,
    },
  },
  { timestamps: false },
);

export { Statistic, statisticSchema };
