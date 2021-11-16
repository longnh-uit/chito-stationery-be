const router = require("express").Router();
const adminController = require("../controller/api/admin");
const authController = require("../controller/auth/admin");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/users", adminController.getAllUser);
router.get("/auth", authController.authToken);

module.exports = router;