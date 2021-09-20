const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({ 
    productName: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    detail: {
        type: String
    },

    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        min: 0,
    },

    image: {
        type: String,
        required: true
    },

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

const Product = mongoose.model("products", productSchema)

module.exports = Product