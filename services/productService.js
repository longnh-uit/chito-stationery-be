const Product = require("../models/database/products")

/**Hàm trả về toàn bộ sản phẩm, nếu thất bại thì trả về null */
async function getAllProduct() {
    try {
        const products = await Product.find();
        if (products) return products;
        else throw "No such a product!!"
    } catch (error) {
        console.log("Error:" + error);
        return null
    }
}

/**Hàm trả về thông tin sản phẩm theo id, nếu thất bại thì trả về null */
async function getProductInfo(productId) {
    try {
        const product = await Product.findById(productId)
        if (product) return product
        else throw "ProductID not found!!"
    } catch (error) {
        console.log("Error: " + error);
        return null
    }
}

/**Hàm tìm sản phẩm theo tên, thất bại thì trả về false */
async function findProductByName(productName) {
    try {
        const products = await Product.find({ productName: new RegExp('^.*'+ productName +'.*$', "i") });
        return products;
    } catch (error) {
        console.log("Error: " + error)
        return false;
    }
}

/**hàm thêm sản phẩm vào database, thành công thì trả về true, thất bại thì trả về false*/
async function addProduct(product) {
    try {
        const newProduct = new Product(product)
        await newProduct.save()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

/**Hàm cập nhật thông tin sản phẩm theo Id, thất bại thì trả về false */
async function updateProduct(id, data) {
    try {
        const newData = await Product.findByIdAndUpdate(id, data, { new: true })
        if (newData) {
            console.log("Update successful!")
            return true;
        }
        else throw "ProductID not found"
    } catch (error) {
        console.log("Error: " + error)
        return false;
    }
}

/**Hàm xoá sản phẩm theo Id, thành công thì trả true, thất bại thì trả false */
async function deleteProduct(id) {
    try {
        if (await Product.findByIdAndDelete(id)) {
            console.log("Delete product successful!")
            return true
        }
        else throw "ProductId not found!";
    } catch (error) {
        console.log("Error: " + error)
        return false;
    }
}

module.exports = {
    getAllProduct,
    getProductInfo,
    findProductByName,
    addProduct,
    updateProduct,
    deleteProduct
}