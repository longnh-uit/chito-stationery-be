const {
    getAllProduct,
    getProductInfo,
    findProductByName,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../../services/productService");

module.exports.getProductById = async (req, res) => {
    const { id } = req.params;
    getProductInfo(id)
        .then((product) => {
            res.json(product);
        })
        .catch((err) => {
            res
                .status(404)
                .json({ error: "Sorry, the product you've searched doesn't seem to exist" });
        });
}

module.exports.searchProduct = async (req, res) => {
    const { q } = req.params;
    const searchedProducts = await findProductByName(q.replace(/\+/, " "));
    return res.json({ searchedProducts })
}

module.exports.getAllProduct = async (req, res) => {
    const products = await getAllProduct();
    res.json({ products });
}