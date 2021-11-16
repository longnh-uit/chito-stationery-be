const router = require("express").Router();
const purchaseController = require("../controller/api/purchaseHistory");

router.post('/', purchaseController.purchase);
router.get('/history', purchaseController.history);
router.get('/history/week', purchaseController.getHistoryCurrentWeek);
router.get('/history/month', purchaseController.getHistoryCurrentMonth);

module.exports = router;