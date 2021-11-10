const PurchaseHistory = require("../models/database/purchaseHistory");

async function purchase(bill) {
    try {
        const newBill = new PurchaseHistory(bill);
        await newBill.save()
    } catch (error) {
        console.log("Error: " + error);
        return false;
    }
}

async function history(email) {
    if (!email) {
        const bills = await PurchaseHistory.find();
        return bills;
    }
    const bills = await PurchaseHistory.find({ customerEmail: email });
    return bills;
}

module.exports = { purchase, history }