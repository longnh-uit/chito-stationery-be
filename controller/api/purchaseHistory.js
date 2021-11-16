const {
    purchase,
    history,
    getHistoryById,
    getHistoryCurrentWeek,
    getHistoryCurrentMonth,
} = require("../../services/purchaseService");

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
            const bills = await history(email);
            return res.json(bills);
        } catch (error) {
            return res.status(400).json({ error: error, success: false })
        }
    } else {
        if (!id) {
            const bills = await history();
            return res.json(bills);
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
        res.json(bills);
    } catch(error) {
        res.status(400).json({ error: error, success: false });
    }
}

module.exports.getHistoryCurrentMonth = async (req, res) => {
    try {
        const bills = await getHistoryCurrentMonth();
        res.json(bills);
    } catch (error) {
        res.status(400).json({ error: error, success: false });
    }
}