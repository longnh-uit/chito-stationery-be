const PurchaseHistory = require("../models/database/purchaseHistory");
const { getProductInfo } = require("./productService");

async function purchase(bill) {
    let productArray = [];
    bill.productList.forEach(product => {
        productArray.push(product);
    });
    bill.productList = productArray;
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