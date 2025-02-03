require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const dbUtils = async (req, res, next) => {
  const client = await pool.connect();
  req.dbClient = client;
  try {
    await next();
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

module.exports = { pool, dbUtils };
