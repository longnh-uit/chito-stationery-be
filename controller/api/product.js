const {
    getAllProduct,
    getProductInfo,
    findProductByName,
    addProduct,
    updateProduct,
    deleteProduct,
    filterProduct
} = require("../../services/productService");

const { getPage } = require("../../helper/utils");

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
    let searchedProducts = await findProductByName(q.replace(/%20/, " "));
    return res.json({ searchedProducts });
}

module.exports.getAllProduct = async (req, res) => {
    const { page } = req.query;
    let products = await getAllProduct();
    const maxPage = Math.round((products.length + 1) / 5);
    products = await getPage(products, page || 1, 5);
    res.json({ products, maxPage });
}

module.exports.filterProduct = async (req, res) => {
    const filteredProducts = await filterProduct(req.query);
    res.json({ filteredProducts });
}