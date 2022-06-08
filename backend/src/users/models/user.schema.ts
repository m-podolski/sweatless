import { Schema, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import validator from "validator";
const { normalizeEmail, isEmail, isAlphanumeric } = validator;

import { Log, logSchema } from "./user.log.schema";
import { Statistic, statisticSchema } from "./user.statistic.schema";
import { Exercise, exerciseSchema } from "./user.exercise.schema";
import { Workout, workoutSchema } from "./user.workout.schema";
import { initialSettings } from "./user.initial-data";

const name = "User";

type UserRole = "USER" | "ADMIN";

interface BasicSetting {
  label: string;
  show: boolean;
}

interface UserTrainingOption {
  label: string;
  fields?: {
    label: string;
    type: "NUMBER" | "TEXT";
    unit?: string;
  }[];
}

interface UserLogField {
  label: "Date" | "Duration" | "Training" | "Notes";
  type: "DATE" | "DURATION" | "LONG_TEXT" | "SELECT";
  options?: UserTrainingOption[];
}

interface UserSettings {
  logs: {
    label: string;
    input: BasicSetting;
    list: BasicSetting;
    fields: UserLogField[];
  };
  statistics: {
    label: string;
    totals: BasicSetting;
    diagrams: BasicSetting & { months: { plottedField: string } };
  };
  workouts: { label: string; panel: BasicSetting };
  exercises: { label: string; panel: BasicSetting };
}

interface User {
  _id: Types.ObjectId;
  email: string;
  password: string;
  username: string;
  role: UserRole;
  firstname: string;
  lastname: string;
  lastLogin: Date;
  settings: UserSettings;
  logs: Types.DocumentArray<Log>;
  statistics: Statistic;
  exercises: Types.DocumentArray<Exercise>;
  workouts: Types.DocumentArray<Workout>;
  isValidPassword: (password: string) => boolean;
}

type UserDocContentFields =
  | Types.DocumentArray<Log>
  | Types.DocumentArray<Exercise>
  | Types.DocumentArray<Workout>;

/**
 * Enum values are used for direct property access with mongoose and must match actual schema fields
 */
enum UserContentField {
  LOG = "logs",
  EXERCISE = "exercises",
  WORKOUT = "workouts",
}

const userValidators = {
  email: {
    validator: (val: string) => {
      if (isEmail(val)) normalizeEmail(val);
    },
    message: (props: { value: string }) =>
      `'${props.value}' is not a valid email adress`,
  },
  alphaNum: {
    validator: (val: string) => isAlphanumeric(val),
    message: (props: { value: string }) =>
      `'${props.value}' is not alphanumeric`,
  },
};

const userSchema = new Schema<User>(
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
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    settings: {
      logs: {
        label: { type: String },
        input: {
          label: { type: String },
          show: { type: Boolean },
        },
        list: {
          label: { type: String },
          show: { type: Boolean },
        },
        fields: [
          {
            _id: false,
            label: {
              type: String,
              enum: ["Date", "Duration", "Training", "Notes"],
            },
            type: {
              type: String,
              enum: ["DATE", "DURATION", "LONG_TEXT", "SELECT"],
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
                      default: "NUMBER",
                      enum: ["NUMBER", "TEXT"],
                    },
                    unit: { type: String, default: "" },
                  },
                ],
              },
            ],
          },
        ],
      },
      statistics: {
        label: { type: String },
        totals: {
          label: { type: String },
          show: { type: Boolean },
        },
        diagrams: {
          label: { type: String },
          show: { type: Boolean },
          months: {
            plottedField: { type: String },
          },
        },
      },
      workouts: {
        label: { type: String },
        panel: {
          label: { type: String },
          show: { type: Boolean },
        },
      },
      exercises: {
        label: { type: String },
        panel: {
          label: { type: String },
          show: { type: Boolean },
        },
      },
    },
    logs: [logSchema],
    statistics: statisticSchema,
    exercises: [exerciseSchema],
    workouts: [workoutSchema],
  },
  {
    methods: {
      async isValidPassword(password: string) {
        return await bcrypt.compare(password, this.password);
      },
    },
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
    this.settings = initialSettings;
  }
  next();
});

export {
  name,
  User,
  UserRole,
  UserTrainingOption,
  UserLogField,
  UserSettings,
  UserContentField,
  UserDocContentFields,
  userSchema,
};
