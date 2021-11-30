const router = require("express").Router();
const userController = require("../controller/api/user");
const middleware = require("../middleware/auth");

router.patch('/changepassword', userController.changePassword);
router.patch('/updateinfo', middleware.authToken, userController.updateInfo);
router.patch('/forgotpassword', userController.forgotPassword);
router.patch('/resetpassword', userController.resetPassword);

module.exports = router;