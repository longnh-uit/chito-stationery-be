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
    let maxItem = 6;
    let products = await getAllProduct();
    const maxPage = Math.ceil(products.length / maxItem);
    products = await getPage(products, page || 1, maxItem);
    res.json({ products, maxPage });
}

module.exports.filterProduct = async (req, res) => {
    const { page } = req.query;
    let maxItem = 12;
    let filteredProducts = await filterProduct(req.query);
    const maxPage = Math.ceil(filteredProducts.length / maxItem);
    filteredProducts = await getPage(filteredProducts, page || 1, maxItem);
    res.json({ filteredProducts, maxPage });
}

module.exports.addProduct = async (req, res) => {
    const product = req.body;
    if (product.productName == "" || product.price == "")
        return res.json({ error: "Please fill in all the required information", success: false });
    return res.json(await addProduct(product));
}

module.exports.deleteProduct = async (req, res) => {
    console.log(req.params.id);
    try {
        await deleteProduct(req.params.id);
        return res.json({ message: "Delete successfully!", success: true });
    } catch (error) {
        return res.status(400).json({ error: "ID not found", success: false });
    }
}
module.exports.updateProduct = async (req, res) => {
    const id = req.body.id;
    const data = {
        productName: req.body.data.productName,
        description: req.body.data.description,
        detail: req.body.data.detail,
        price: req.body.data.price,
        type: req.body.data.type
    };
    updateProduct(id, data)
        .then(() => {
            return res.json({ msg: "Update successfully!", success: true });
        })
        .catch(error => {
            res.status(400).json({ error: "Something went wrong", success: false });
        });
}