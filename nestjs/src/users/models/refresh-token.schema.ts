import { Schema } from "mongoose";

import { UserModuleConfiguration } from "../configuration";
import { UserRole } from "./user.schema";

const config = new UserModuleConfiguration();
const name = "RefreshToken";

interface RefreshToken {
  token: string;
  expires: Date;
  sub: string;
  role: UserRole;
}

const refreshTokenSchema = new Schema<RefreshToken>(
  {
    token: {
      type: String,
      required: [true, "'token' is required"],
    },
    expires: {
      type: Date,
      required: [true, "'expires' is required"],
      default: Date.now,
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

export { name, RefreshToken, refreshTokenSchema };
