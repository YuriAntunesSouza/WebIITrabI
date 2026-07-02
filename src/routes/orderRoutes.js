const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const sellerMiddleware = require("../middlewares/sellerMiddleware");
const orderController = require("../controllers/orderController");

router.post("/cart/add", orderController.addToCart);
router.post("/cart/remove", orderController.removeFromCart);
router.get("/cart", orderController.showCart);
router.get("/checkout", authMiddleware, orderController.showCheckout);
router.post("/checkout", authMiddleware, orderController.createOrder);
router.get("/orders", authMiddleware, orderController.listOrders);
router.post("/orders/:id/status", authMiddleware, sellerMiddleware, orderController.updateOrderStatus);

module.exports = router;
