const router = require("express").Router();
const authController = require("../controller/auth/auth");
const { authSignup } = require("../middleware/auth")

router.post("/signup", authSignup, authController.signup_post);
router.get("/activate/:token", authController.activate);
router.post("/login", authController.login_post);
router.get("/", authController.authenticate);
router.post("/refresh",authController.refresh);

module.exports = router