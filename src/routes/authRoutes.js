const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify", AuthController.verify);
router.post("/resend-code", AuthController.resendCode);

module.exports = router;