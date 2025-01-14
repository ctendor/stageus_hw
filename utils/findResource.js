const db = require("../utils/dbConnect");

const findResourceById = async (table, id) => {
  const [rows] = await db.query(`SELECT * FROM ?? WHERE idx = ?`, [table, id]);

  if (rows.length === 0) {
    throw new Error(
      `${table}에서 id=${id}에 해당하는 리소스를 찾을 수 없습니다.`
    );
  }

  return rows[0];
};

module.exports = {
  findResourceById,
};
