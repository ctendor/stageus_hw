const { getFilteredLogs } = require("./logService");
const asyncWrapper = require("../utils/asyncWrapper");

const getLogsController = asyncWrapper(async (req, res) => {
  const { userId, startDate, endDate, sort = "desc" } = req.query;

  // Service를 호출하여 필터링된 로그 가져오기
  const logs = await getFilteredLogs({ userId, startDate, endDate, sort });

  res.status(200).send(logs);
});

module.exports = { getLogsController };
