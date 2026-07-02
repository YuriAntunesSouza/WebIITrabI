require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const AdminController = require("./controllers/adminController");
const authMiddleware = require("./middlewares/authMiddleware");
const adminMiddleware = require("./middlewares/adminMiddleware");
const sellerMiddleware = require("./middlewares/sellerMiddleware");
const logMiddleware = require("./middlewares/logMiddleware");
const buyerProfileRoutes = require("./routes/buyerProfileRoutes");
const sellerProfileRoutes = require("./routes/sellerProfileRoutes");
const productRoutes = require("./routes/productRoutes");
const productController = require("./controllers/productController");
const commentRoutes = require("./routes/commentRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Middlewares globais 
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
app.use("/buyer", buyerProfileRoutes);
app.use("/seller", sellerProfileRoutes);
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));


app.get("/", async (req, res) => {
  const prisma = require("./config/prisma");
  const { q } = req.query;
  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      }
    : {};
  const [products, allCategories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { Images: true, User: { include: { SellerProfile: true } } },
      orderBy: { createdAt: "desc" },
      take: q ? undefined : 6,
    }),
    prisma.product.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);
  const categories = allCategories.map((p) => p.category);
  res.render("index", { products, categories, q: q || "" });
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
app.post("/admin/activate/:id", authMiddleware, adminMiddleware, AdminController.activateUser);

app.get("/admin/logs", authMiddleware, adminMiddleware, AdminController.logs);

app.get("/categories", async (req, res) => {
  const prisma = require("./config/prisma");
  const { category } = req.query;
  const where = category ? { category } : {};
  const [products, allCategories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { Images: true, User: { include: { SellerProfile: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);
  const categories = allCategories.map((p) => p.category);
  res.render("categories", { products, categories, selectedCategory: category || null });
});

app.use(orderRoutes);

app.get("/seller", authMiddleware, sellerMiddleware, productController.dashboard);

app.use("/products", productRoutes);

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.use("/comments", commentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});