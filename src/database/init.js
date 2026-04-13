const db = require("./db");

db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      isActive INTEGER DEFAULT 0,
      isVerified INTEGER DEFAULT 0,
      verificationCode TEXT,
      verificationExpires INTEGER
    )
  `);

  // Tabela de logs
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      method TEXT,
      route TEXT,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Administrador padrão
  db.run(
    `INSERT OR IGNORE INTO users (name, email, password, role, isActive, isVerified)
     VALUES (?, ?, ?, ?, 1, 1)`,
    [
      "Admin",
      "admin@marketmvp.com",
      "$2b$10$YRv2KzRzE5xKV8s.gFP3r.iDiBi.na/6GZlwFCBqyHKPI73lKlaxG",
      "administrador"
    ],
    (err) => {
      if (!err) console.log("Usuário administrador criado (ou já existia).");
    }
  );

  console.log("Tabelas criadas com sucesso.");
});