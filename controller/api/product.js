const {
    getAllProduct,
    getProductInfo,
    findProductByName,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../../services/productService");

module.exports.getProductById = async (req, res, next) => {
    const { id } = req.query;
    if (id)
        getProductInfo(id)
            .then((product) => {
                res.json(product);
            })
            .catch((err) => {
                res
                    .status(404)
                    .json({ error: "Sorry, the product you've searched doesn't seem to exist", success: false });
            });
    else next();
}

module.exports.searchProduct = async (req, res) => {
    const { q } = req.query;
    if (q === "" || q == null) return res.json({ searchedProducts: [] });
    const searchedProducts = await findProductByName(q.replace(/%20/, " "));
    return res.json({ searchedProducts })
}

module.exports.getAllProduct = async (req, res) => {
    const products = await getAllProduct();
    res.json({ products });
}