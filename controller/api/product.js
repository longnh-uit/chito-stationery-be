const {
    getAllProduct,
    getProductdata,
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
        getProductdata(id)
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

module.exports.addProduct = async (req, res) => {
    await addProduct(req.body) 
    res.json({message:"Add successfully!", success:true});
}

module.exports.deleteProduct = async (req, res) => {
    await deleteProduct(req.body)
    res.json({message:"Delete successfully!", success:true});
}
module.exports.updateProduct = async (req, res) => {
    const id = req.body.id;
    const data = {
        productName: req.body.data.productName,
        desciption: req.body.data.desciption,
        detail: req.body.data.detail,
        price: req.body.data.price,
        type: req.body.data.type
    };
    updateProduct(id, data)
        .then(() => {
            return res.json({ msg: "Update successfully!", success: true });
        })
        .catch(error => {
            res.status(400).json({ error: error, success: false });
        });
}