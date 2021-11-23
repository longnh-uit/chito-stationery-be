const router = require("express").Router();
const productController = require("../controller/api/product")

router.get('/', productController.getProductById, productController.getAllProduct);
router.get('/search', productController.searchProduct); // q nhớ thay dấu " " bằng dấu "%20"
router.get('/filter', productController.filterProduct);
router.patch('/add', productController.addProduct);
router.patch('/delete', productController.deleteProduct);
router.patch('/update', productController.updateProduct);
module.exports = router;