const {
    purchase
} = require("../../services/purchaseService");

module.exports.purchase = async (req, res) => {
    const bill = req.body;
    try {
        if (!purchase(bill)) throw "Purchase failed!"
        return res.json({ message: "Purchase successful!", success: true });
    } catch(error) {
        return res.status(400).json({ error: error, success: false });
    }
}