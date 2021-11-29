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
    try {
        if (!await purchase(bill)) throw "Purchase failed!"
        return res.json({ message: "Purchase successfully!", success: true });
    } catch (error) {
        return res.status(400).json({ error: error, success: false });
    }
}

module.exports.history = async (req, res) => {
    const { email, id, page } = req.query;
    if (email) {
        try {
            let bills = await history(email);
            const maxPage = Math.ceil((bills.length + 1) / 10);
            bills = await getPage(bills, page || 1, 10);
            return res.json({ orders: bills, maxPage });
        } catch (error) {
            return res.status(400).json({ error: error, success: false })
        }
    } else {
        if (!id) {
            let bills = await history();
            const totalOrder = bills.length;
            const maxPage = Math.ceil((bills.length + 1) / 10);
            bills = await getPage(bills, page || 1, 10);
            return res.json({ orders: bills, maxPage, totalOrder });
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