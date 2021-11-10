const {
    purchase,
    history
} = require("../../services/purchaseService");

module.exports.purchase = async (req, res) => {
    const bill = req.body;
    if (!bill.customerEmail) bill.customerEmail = "";
    try {
        if (!(purchase(bill))) throw "Purchase failed!"
        return res.json({ message: "Purchase successful!", success: true });
    } catch(error) {
        return res.status(400).json({ error: error, success: false });
    }
}

module.exports.history = async (req, res) => {
    const { email } = req.query;
    try {
        const bills = await history(email);
        return res.json(bills);
    } catch(error) {
        return res.status(400).json({ error: error, success: false })
    }
}