import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
const { normalizeEmail, isEmail, isAlphanumeric } = validator;
import { logSchema } from "./Log.js";
import { exerciseSchema } from "./Exercise.js";
import { workoutSchema } from "./Workout.js";
import { initialLogFields } from "../models/initUser.js";

const { Schema } = mongoose;

const userValidators = {
  email: {
    validator: (val) => isEmail(normalizeEmail(val)),
    message: (props) => `'${props.value}' is not a valid email adress`,
  },
  alphaNum: {
    validator: (val) => isAlphanumeric(val),
    message: (props) => `'${props.value}' is not alphanumeric`,
  },
};

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, "'email' is required"],
      validate: userValidators.email,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "'password' is required"],
    },
    username: {
      type: String,
      trim: true,
      required: [true, "'username' is required"],
      validate: userValidators.alphaNum,
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: ["ADMIN", "USER"],
        message: "User must have role of 'ADMIN' or 'USER'",
      },
      default: "USER",
    },
    firstname: {
      type: String,
      trim: true,
      required: [true, "'firstname' is required"],
      validate: userValidators.alphaNum,
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, "'lastname' is required"],
      validate: userValidators.alphaNum,
    },
    lastlogin: {
      type: Date,
      default: Date.now,
    },
    settings: {
      logs: {
        label: { type: String, default: "Logs" },
        input: {
          label: { type: String, default: "Input" },
          show: { type: Boolean, default: true },
        },
        list: {
          label: { type: String, default: "List" },
          show: { type: Boolean, default: true },
        },
        fields: [
          {
            _id: false,
            label: {
              type: String,
              enum: ["Date", "Duration", "Training", "Notes"],
            },
            type: { type: String, enum: ["date", "text", "select"] },
            // all regexes in pattern attributes must be escaped two times because jsx removes escapes when rendering
            pattern: {
              type: String,
              enum: ["", "[\\d: \\.,]{1,7}", ".{0,250}"],
            },
            unit: { type: String, default: null },
            errorMsg: { type: String },
            footnote: {
              type: String,
              trim: true,
            },
            options: [
              {
                _id: false,
                label: String,
                fields: [
                  {
                    _id: false,
                    label: String,
                    type: {
                      type: String,
                      default: "number",
                      enum: ["number", "text"],
                    },
                    pattern: {
                      type: String,
                      default: "[\\d: \\.,]{1,6}",
                      enum: ["[\\d: \\.,]{1,6}", ".{1,100}"],
                    },
                    unit: { type: String, default: "" },
                    errorMsg: String,
                  },
                ],
              },
            ],
          },
        ],
      },
      stats: {
        label: { type: String, default: "Log Statistics" },
        totals: {
          label: { type: String, default: "Log Totals" },
          show: { type: Boolean, default: true },
        },
        diagrams: {
          label: { type: String, default: "Diagrams" },
          show: { type: Boolean, default: true },
          graph: {
            plottedField: { type: String, default: "Distance" },
          },
        },
      },
      workouts: {
        label: { type: String, default: "Workouts" },
        panel: {
          label: { type: String, default: "Panel" },
          show: { type: Boolean, default: true },
        },
      },
      exercises: {
        label: { type: String, default: "Exercises" },
        panel: {
          label: { type: String, default: "Panel" },
          show: { type: Boolean, default: true },
        },
      },
    },
    logs: [logSchema],
    statistics: {
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
      graph: {
        data: [{ _id: false, name: String, total: Number, fields: [Number] }],
        keys: [String],
        unit: String,
      },
    },
    exercises: [exerciseSchema],
    workouts: [workoutSchema],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
    this.settings.logs.fields = initialLogFields;
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
