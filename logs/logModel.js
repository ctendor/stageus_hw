const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  useridx: { type: String, default: null },
  date: { type: Date, default: Date.now },
  method: { type: String },
  originalUrl: { type: String },
  statusCode: { type: Number },
  requestBody: { type: mongoose.Schema.Types.Mixed },
  requestQuery: { type: mongoose.Schema.Types.Mixed },
  requestParams: { type: mongoose.Schema.Types.Mixed },
  responseBody: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
});

module.exports = mongoose.model("Log", LogSchema);
