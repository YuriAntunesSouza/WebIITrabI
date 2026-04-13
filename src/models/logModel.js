const db = require("../database/db");

const LogModel = {
  create: ({ userId, method, route, description }) => {
    const sql = `
      INSERT INTO logs (userId, method, route, description)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [
      userId || null,
      method,
      route,
      description
    ]);
  }
};

module.exports = LogModel;