const db = require("../database/db");

const userModel = {
  create: (user, callback) => {
    const sql = `
      INSERT INTO users (name, email, password, role, verificationCode, verificationExpires)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [
        user.name,
        user.email,
        user.password,
        user.role,
        user.verificationCode,
        user.verificationExpires
      ],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  },

  findByEmail: (email, callback) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], callback);
  },

  verifyUser: (email, code, callback) => {
  const sql = `
    UPDATE users
    SET isVerified = 1, isActive = 1
    WHERE email = ?
      AND verificationCode = ?
      AND verificationExpires > ?
  `;

  db.run(sql, [email, code, Date.now()], function (err) {
    callback(err, this.changes);
  });},

  updateVerificationCode: (email, code, expires, callback) => {
  const sql = `
    UPDATE users
    SET verificationCode = ?, verificationExpires = ?
    WHERE email = ?
  `;

  db.run(sql, [code, expires, email], function (err) {
    callback(err, this.changes);
  });},

  getAllUsers: (callback) => {
  db.all("SELECT * FROM users", [], callback);
  },

  deactivateUser: (id, callback) => {
    const sql = `
      UPDATE users
      SET isActive = 0
      WHERE id = ?
    `;

    db.run(sql, [id], function (err) {
      callback(err, this.changes);
    });
  },
  activateUser: (id, callback) => {
  const sql = `
    UPDATE users
    SET isVerified = 1, isActive = 1
    WHERE id = ?
  `;

  db.run(sql, [id], function (err) {
    callback(err);
  });
  },

  getLogs: (callback) => {
    db.all("SELECT * FROM logs ORDER BY createdAt DESC", [], callback);
  }

  };

module.exports = userModel;