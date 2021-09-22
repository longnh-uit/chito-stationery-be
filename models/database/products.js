const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({ 
    productName: { type: String, required: true },
    description: String,
    detail: String,
    price: { type: mongoose.Types.Decimal128, required: true, min: 0 },
    image: { type: String, required: true },
    type: {
        type: [
          {
            typeName: {
                type: String,
                // required: true,
            },
    
            image: {
                type: String,
                // required: true
            }
        }]
    }
})

module.exports = mongoose.model("Products", productSchema)