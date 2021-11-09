const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema({
    customerAddress: {type: String, required: true},
    customerEmail: {type: String, required: true},
    customerName: {type: String, required: true},
    customerPhone: String,
    productList: [
        {
            productName: { type: String, required: true },
            type: { type: String },
            description: { type: String },
            detail: { type: String },
            price: { type: mongoose.Types.Decimal128, required: true, min: 0 },
            image: { type: String, required: true },
            quantity: { type: Number },
            totalCost: { type: mongoose.Types.Decimal128 }
        }
    ],
    totalCost: { type: mongoose.Types.Decimal128, required: true, min: 0 },
}, { timestamps: true })

module.exports = mongoose.model("PurchaseHistory", purchaseHistorySchema);