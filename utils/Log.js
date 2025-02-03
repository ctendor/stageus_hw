const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userIdx: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  request: {
    method: String,
    url: String,
    headers: Object,
    body: Object,
    query: Object,
  },
  response: {
    statusCode: Number,
    headers: Object,
    body: Object,
  },
});

module.exports = mongoose.model("Log", logSchema);
