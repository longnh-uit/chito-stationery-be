const router = require("express").Router();
const contactController = require("../controller/api/contact");

router.post("/add", contactController.addContact);

module.exports = router;