const router = require("express").Router();
const adminController = require("../controller/api/admin");

router.get("/users", adminController.getAllUser);

module.exports = router;