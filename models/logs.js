const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Log = mongoose.model("Log", logsSchema);

module.exports = Log;
