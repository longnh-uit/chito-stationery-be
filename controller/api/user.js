const { changePassword } = require("../../services/userService");

module.exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    if (email && oldPassword && newPassword) {
        try {
            if (await changePassword(email, oldPassword, newPassword))
                return res.json({ msg: "Change password successful!", success: true });
        } catch (error) {
            return res.status(400).json({ error: error, success: false });
        }
    } else {
        return res.status(400).json({ error: "Not enough information", success: false });
    }
}