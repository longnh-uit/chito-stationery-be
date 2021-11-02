const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema({
    customerAddress: {type: String, required: true},
    customerEmail: {type: String, required: true},
    customerName: {type: String, required: true},
    customerPhone: String,
    productList: [
        {
            product: mongoose.Types.ObjectId,
            price: mongoose.Types.Decimal128,
            quantity: Number
        }
    ],
    totalCost: { type: mongoose.Types.Decimal128, required: true, min: 0 },
}, { timestamps: true })

module.exports = mongoose.model("PurchaseHistory", purchaseHistorySchema);