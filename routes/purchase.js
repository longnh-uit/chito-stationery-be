const router = require("express").Router();
const purchaseController = require("../controller/api/purchaseHistory");

router.post('/', purchaseController.purchase);

module.exports = router;