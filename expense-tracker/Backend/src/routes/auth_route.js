const express = require("express");
const router = express.Router();
const { getAuthMessage, registerUser } = require("../controllers/auth_controller");

router.get("/", getAuthMessage);
router.post("/register", registerUser);


module.exports = router;