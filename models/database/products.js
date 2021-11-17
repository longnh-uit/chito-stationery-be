const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({ 
    productName: { type: String, required: true },
    type: String,
    description: String,
    detail: String,
    price: { type: mongoose.Types.Decimal128, required: true, min: 0 },
    image: { type: String}
})

module.exports = mongoose.model("Products", productSchema)