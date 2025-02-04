const logService = require("./logService");

const getLogsController = async (req, res, next) => {
  try {
    const { order, useridx, startDate, endDate } = req.query;
    const logs = await logService.getLogs({
      order,
      useridx,
      startDate,
      endDate,
    });
    return res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLogsController,
};
