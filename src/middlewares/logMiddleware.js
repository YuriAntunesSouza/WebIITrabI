const LogModel = require("../models/logModel");
const jwt = require("jsonwebtoken");

function logMiddleware(req, res, next) {
  if (req.method === "GET") {
    return next();
  }

  let userId = null;

  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      userId = null;
    }
  }

  const route = req.originalUrl;
  const method = req.method;
  let description = `Acesso à rota ${route}`;

  res.on("finish", () => {
    LogModel.create({
      userId,
      method,
      route,
      description: `${description} - Status ${res.statusCode}`
    });
  });

  next();
}

module.exports = logMiddleware;