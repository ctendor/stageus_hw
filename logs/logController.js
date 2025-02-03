// logs/logController.js
const logService = require("./logService");

/**
 * 관리자 전용 로그 조회
 * GET /logs?order=asc|desc&useridx=xxx&startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 */
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
