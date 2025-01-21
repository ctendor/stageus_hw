const db = require("../utils/dbConnect");

const dbMiddleware = async (req, res, next) => {
  const client = await db.connect();
  req.dbClient = client;
  try {
    await next();
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

module.exports = dbMiddleware;
