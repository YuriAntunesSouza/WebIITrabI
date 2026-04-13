function adminMiddleware(req, res, next) {
  if (req.user.role !== "administrador") {
    return res.send("Acesso negado: apenas administradores");
  }

  next();
}

module.exports = adminMiddleware;