const router = require("express").Router();
const purchaseController = require("../controller/api/purchaseHistory");

router.post('/', purchaseController.purchase);
router.get('/history', purchaseController.history);

module.exports = router;