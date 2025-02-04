// logs/logService.js
const Log = require("./logModel");

/**
 * 로그 생성 (Service)
 * @param {object} logData - 로그 저장용 데이터
 */
const createLog = async (logData) => {
  return await Log.create(logData);
};

/**
 * 로그 조회 (Service)
 * @param {object} filters - { useridx, startDate, endDate, order }
 * @returns {Promise<Log[]>} 조회 결과
 */
const getLogs = async (filters) => {
  let { useridx, startDate, endDate, order = "asc" } = filters;
  const sortOrder = order === "desc" ? -1 : 1;

  const query = {};
  if (useridx) {
    query.useridx = useridx;
  }
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  // date 기준 정렬
  const logs = await Log.find(query).sort({ date: sortOrder });
  return logs;
};

module.exports = {
  createLog,
  getLogs,
};
