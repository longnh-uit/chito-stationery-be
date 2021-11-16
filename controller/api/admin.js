const { getAllUser } = require("../../services/userService");

module.exports.getAllUser = async (req, res) => {
    try {
        const users = await getAllUser();
        return res.json(users);
    } catch (error) {
        return res.status(400).json({ error: error, success: false });
    }
}