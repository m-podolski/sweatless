import { Schema } from "mongoose";

import { AppModuleConfiguration } from "../../configuration";

const config = new AppModuleConfiguration();

interface Exercise {
  name: string;
  equipment: string;
  instructions: string[];
  files: {
    path: string;
    displayName: string;
    caption: string;
  }[];
}

const exerciseSchema = new Schema<Exercise>(
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
          get: (path: string) => `${config.env.host}/${path}`,
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

export { Exercise, exerciseSchema };
