const mongoose = require("mongoose");
const { Schema } = mongoose;

const logsSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    results: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logsSchema);
