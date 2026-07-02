const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const buyerProfileController = require("../controllers/buyerProfileController");

router.get("/profile", authMiddleware, buyerProfileController.show);
router.post("/profile", authMiddleware, buyerProfileController.save);

module.exports = router;