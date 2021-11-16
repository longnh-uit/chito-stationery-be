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

async function getHistoryById(id) {
    const info = await PurchaseHistory.findById(id);
    if (info) return info;
    else throw "Id not found.";
}

async function getHistoryCurrentWeek() {

    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        return d;
    }

    const bills = await PurchaseHistory.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: getMonday(new Date())
                }
            }
        }
    ]);

    return bills;
}

async function getHistoryCurrentMonth() {
    
    function getFirstDateOfMonth() {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDay;
    }

    const bills = await PurchaseHistory.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: getFirstDateOfMonth()
                }
            }
        }
    ]);

    return bills;
}

module.exports = { 
    purchase,
    history, 
    getHistoryById, 
    getHistoryCurrentWeek,
    getHistoryCurrentMonth
}