import { Schema } from "mongoose";

interface Workout {
  name: string;
  blocks: {
    blockTitle: string;
    sections: {
      sectionTitle: string;
      units: {
        exercise_id: Schema.Types.ObjectId;
        details: string;
      }[];
    }[];
  }[];
}

const workoutSchema = new Schema<Workout>(
  {
    name: {
      type: String,
      required: [true, "'name' is required"],
      maxLength: [100, "'name' max. length is 100, got {VALUE}"],
      trim: true,
    },
    blocks: [
      {
        _id: false,
        blockTitle: { type: String, trim: true },
        sections: [
          {
            _id: false,
            sectionTitle: { type: String, trim: true },
            units: [
              {
                _id: false,
                exercise_id: { type: Schema.Types.ObjectId, trim: true },
                details: { type: String, trim: true },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: false },
);

export { Workout, workoutSchema };
