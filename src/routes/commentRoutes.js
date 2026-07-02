const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { commentImageUpload } = require("../config/upload");
const commentController = require("../controllers/commentController");

// Criar comentário (foto opcional)
router.post("/", authMiddleware, commentImageUpload.single("image"), commentController.create);

// Deletar comentário
router.post("/:id/delete", authMiddleware, commentController.delete);

// Toggle curtida
router.post("/:id/like", authMiddleware, commentController.toggleLike);

module.exports = router;