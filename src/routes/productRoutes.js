const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const sellerMiddleware = require("../middlewares/sellerMiddleware");
const { productImageUpload } = require("../config/upload");
const productController = require("../controllers/productController");

// Painel do vendedor
router.get("/", authMiddleware, sellerMiddleware, productController.dashboard);

// Criar produto
router.post(
  "/",
  authMiddleware,
  sellerMiddleware,
  productImageUpload.array("images", 5),
  productController.create
);

// Deletar produto
router.post("/:id/delete", authMiddleware, sellerMiddleware, productController.delete);

// Detalhes do produto
router.get("/:id", productController.show);

module.exports = router;