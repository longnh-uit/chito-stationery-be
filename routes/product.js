const router = require("express").Router();
const productController = require("../controller/api/product")

router.get('/:id', productController.getProductById);
router.get('/search/:q', productController.searchProduct); // q nhớ thay dấu " " bằng dấu "+"
router.get('/', productController.getAllProduct);

module.exports = router;