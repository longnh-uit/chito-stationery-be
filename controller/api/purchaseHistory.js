const {
    purchase,
    history,
    getHistoryById
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
        if (!id) return res.status(404).json({ error: "No id or email provided", success: false });
        try {
            const bill = await getHistoryById(id);
            return res.json(bill);
        } catch (error) {
            res.status(404).json({ error: error, success: false })
        }
    }
}