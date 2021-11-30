const Product = require("../models/database/products")

/**Hàm trả về toàn bộ sản phẩm, nếu thất bại thì trả về null */
async function getAllProduct() {
    try {
        const products = await Product.find().sort({ createdAt: -1, id: -1 });
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
        throw error
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
        return { message: "Add successfull!", success: true };
    } catch (error) {
        console.log(error.message);
        return { error: "Something went wrong", success: false }
    }
}

/**Hàm cập nhật thông tin sản phẩm theo Id, thất bại thì trả về false */
async function updateProduct(id, data) {
    try {
        const newData = await Product.findByIdAndUpdate(id, data, { new: true })
        if (newData) {
            console.log("Update successfully!");
            return true;
        }
        else throw "ProductID not found"
    } catch (error) {
        console.log("Error: " + error.message)
        throw erorr;
    }
}

/**Hàm xoá sản phẩm theo Id, thành công thì trả true, thất bại thì trả false */
async function deleteProduct(id) {
    try {
        if (await Product.findByIdAndDelete(id)) {
            console.log("Delete product successfully!")
            return true
        }
        else throw new Error("ProductId not found!");
    } catch (error) {
        console.log("Error: " + error.message);
        throw error;
    }
}

async function filterProduct(filter) {
    let products = await getAllProduct();
    const { type, higherPrice, lowerPrice, sortType } = filter;
    if (type) {
        products = await products.filter(product => {
            if (typeof type == "string") {
                return product.type == type;
            }

            else {
                try {
                    type.forEach(e => {
                    if (product.type == e)
                        throw true;
                    })
                    return false;
                } catch (result) {
                    return result;
                }
            }
        });
    }
    
    if (higherPrice) {
        products = await products.filter(product => product.price >= Number(higherPrice));
    }

    if (lowerPrice) {
        products = await products.filter(product => product.price <= Number(lowerPrice));
    }

    // Price sort type: Low to high
    if (sortType == 1) {
        products.sort((a, b) => {
            return a.price - b.price;
        })
    } else if (sortType == 2) {
        products.sort((a, b) => {
            return b.price - a.price;
        })
    }

    return products;
}

module.exports = {
    getAllProduct,
    getProductInfo,
    findProductByName,
    addProduct,
    updateProduct,
    deleteProduct,
    filterProduct
}