require("dotenv").config();
require("./database/db");

const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const AdminController = require("./controllers/adminController");
const authMiddleware = require("./middlewares/authMiddleware");
const adminMiddleware = require("./middlewares/adminMiddleware");
const logMiddleware = require("./middlewares/logMiddleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  try {
    const token = req.cookies.token;
    res.locals.user = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
  } catch {
    res.locals.user = null;
  }
  next();
});
app.use(logMiddleware);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/verify", (req, res) => {
  res.render("verify");
});

app.get("/admin", authMiddleware, adminMiddleware, AdminController.dashboard);

app.post("/admin/deactivate/:id", authMiddleware, adminMiddleware, AdminController.deactivateUser);

app.get("/admin/logs", authMiddleware, adminMiddleware, AdminController.logs);

app.get("/categories", (req, res) => {
  res.render("categories");
});

app.get("/product-details", (req, res) => {
  res.render("product-details");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.get("/orders", authMiddleware, (req, res) => {
  res.render("orders");
});

app.get("/seller", authMiddleware, (req, res) => {
  res.render("seller-dashboard");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});