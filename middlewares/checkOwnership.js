const asyncWrapper = require("../utils/asyncWrapper");
const customError = require("../utils/customError");
const { findResourceById } = require("../utils/findResource");

const checkOwnership = (resourceTable, resourceIdField) => {
  return asyncWrapper(async (req, res, next) => {
    const resourceId = req.params[resourceIdField];

    if (!resourceId) {
      throw customError("리소스 ID가 제공되지 않았습니다.", 400);
    }

    const resource = await findResourceById(resourceTable, resourceId);
    if (!resource) {
      throw customError(
        `ID ${resourceId}에 해당하는 리소스를 찾을 수 없습니다.`,
        404
      );
    }

    const { id: userId } = req.user;
    if (resource.authorIdx !== userId) {
      throw customError("해당 리소스에 대한 접근 권한이 없습니다.", 403);
    }

    console.log(`리소스 소유권 확인 성공: ${userId} → ${resourceId}`);
    next();
  });
};

module.exports = checkOwnership;
