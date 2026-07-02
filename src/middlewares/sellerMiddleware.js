function sellerMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "vendedor") {
    return res.redirect("/");
  }

  next();
}

module.exports = sellerMiddleware;
