const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const sellerProfileController = require("../controllers/sellerProfileController");

// Edição do perfil 
router.get("/profile", authMiddleware, sellerProfileController.show);
router.post("/profile", authMiddleware, sellerProfileController.save);

// Perfil público
router.get("/public/:id", sellerProfileController.showPublic);

module.exports = router;