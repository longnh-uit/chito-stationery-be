const {
    purchase,
    history,
    getHistoryById,
    getHistoryCurrentWeek,
    getHistoryCurrentMonth,
} = require("../../services/purchaseService");
const { getPage } = require("../../helper/utils");

module.exports.purchase = async (req, res) => {
    const bill = req.body;
    if (!bill.customerEmail) bill.customerEmail = "";
    try {
        if (!(purchase(bill))) throw "Purchase failed!"
        return res.json({ message: "Purchase successful!", success: true });
    } catch (error) {
        return res.status(400).json({ error: error, success: false });
    }
}

module.exports.history = async (req, res) => {
    const { email, id } = req.query;
    if (email) {
        try {
            let bills = await history(email);
            const maxPage = Math.round((bills.length + 1) / 5);
            bills = await getPage(bills, page || 1, 5);
            return res.json({ orders: bills, maxPage });
        } catch (error) {
            return res.status(400).json({ error: error, success: false })
        }
    } else {
        if (!id) {
            let bills = await history();
            const maxPage = Math.round((bills.length + 1) / 5);
            bills = await getPage(bills, page || 1, 5);
            return res.json({ orders: bills, maxPage });
        }
        try {
            const bill = await getHistoryById(id);
            return res.json(bill);
        } catch (error) {
            res.status(404).json({ error: error, success: false })
        }
    }
}

module.exports.getHistoryCurrentWeek = async (req, res) => {
    try {
        const bills = await getHistoryCurrentWeek();
        let sales = 0;
        bills.forEach(x => {
            sales += +x.totalCost.toString();
        })
        res.json({ orders: bills, sales });
    } catch(error) {
        res.status(400).json({ error: error, success: false });
    }
}

module.exports.getHistoryCurrentMonth = async (req, res) => {
    try {
        const bills = await getHistoryCurrentMonth();
        let sales = 0;
        bills.forEach(x => {
            sales += +x.totalCost.toString();
        })
        res.json({ orders: bills, sales });
    } catch (error) {
        res.status(400).json({ error: error, success: false });
    }
}