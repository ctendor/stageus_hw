const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: { type: Number, required: false },
  date: { type: Date, required: true, default: Date.now },
  request: {
    url: String,
    method: String,
    body: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed,
  },
  response: {
    statusCode: Number,
    message: String,
  },
  error: {
    message: String,
    stack: String,
  },
  ip: String,
});

const Log = mongoose.model("Log", logSchema);

const saveLog = async (logData) => {
  try {
    const log = new Log(logData);
    await log.save();
    console.log("로그 저장 성공:", logData);
  } catch (err) {
    console.error("로그 저장 실패:", err);
  }
};

module.exports = { saveLog, Log };
