const router = require("express").Router();
const contactController = require("../controller/api/contact");

router.post("/add", contactController.addContact);
router.get("/",contactController.getContactById , contactController.getAllContact);

module.exports = router;