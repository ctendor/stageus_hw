// utils/dbConnect.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// query 함수 추가: pool.query를 래핑합니다.
const query = (text, params) => pool.query(text, params);

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

module.exports = { pool, query, dbUtils };
