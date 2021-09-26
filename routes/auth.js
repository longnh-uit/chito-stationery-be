const router = require("express").Router;
const authController = require("../controller/auth/auth");

router.post("/signup", authController.signup_post);
router.get("/activate/:token", authController.activate)