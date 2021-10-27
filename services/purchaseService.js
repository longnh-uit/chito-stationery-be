const PurchaseHistory = require("../models/database/purchaseHistory");

async function purchase(bill) {
    try {
        const newBill = new PurchaseHistory(bill);
        await newBill.save();
        return true;
    } catch (error) {
        console.log("Error: " + error);
        return false;
    }
}

module.exports = { purchase }