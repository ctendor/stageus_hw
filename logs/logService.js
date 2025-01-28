const { Log } = require("../utils/logger");

const getFilteredLogs = async ({ userId, startDate, endDate, sort }) => {
  const filter = {};

  if (userId) {
    filter.userId = userId;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const logs = await Log.find(filter).sort({ date: sort === "asc" ? 1 : -1 });

  return logs;
};

module.exports = { getFilteredLogs };
