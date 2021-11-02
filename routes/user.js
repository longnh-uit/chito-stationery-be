const router = require("express").Router();
const userController = require("../controller/api/user");
const middleware = require("../middleware/auth");

router.patch('/changepassword', userController.changePassword);
router.patch('/updateinfo', middleware.authToken, userController.updateInfo);

module.exports = router;