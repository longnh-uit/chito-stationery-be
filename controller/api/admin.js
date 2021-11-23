const { getAllUser } = require("../../services/userService");
const { getPage } = require("../../helper/utils");

module.exports.getAllUser = async (req, res) => {
    try {
        const { page } = req.query;
        let users = await getAllUser();
        const maxPage = Math.round((users.length + 1) / 10);
        users = await getPage(users, page || 1, 10);
        return res.json({ users, maxPage });
    } catch (error) {
        return res.status(400).json({ error: error.message, success: false });
    }
}