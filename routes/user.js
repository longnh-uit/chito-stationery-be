const router = require("express").Router();
const userController = require("../controller/api/user");

router.post('/changepassword', userController.changePassword);

module.exports = router;