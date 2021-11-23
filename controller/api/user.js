const { 
    changePassword,
    updateInfo
} = require("../../services/userService");

module.exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    if (email && oldPassword && newPassword) {
        try {
            if (await changePassword(email, oldPassword, newPassword))
                return res.json({ msg: "Change password successfully!", success: true });
        } catch (error) {
            return res.status(400).json({ error: error, success: false });
        }
    } else {
        return res.status(400).json({ error: "Not enough information", success: false });
    }
}

module.exports.updateInfo = async (req, res) => {
    const email = req.body.email;
    const info = {
        fullname: req.body.info.fullname,
        phone: req.body.info.phone,
        dob: req.body.info.dob,
        address: req.body.info.address
    };

    const fullnameRegEx = /.{3,35}/;
    const phoneRegEx = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

    if (info.fullname && !fullnameRegEx.test(info.fullname))
        return res.status(400).json({ error:"Username must be from 3 to 35 character", success: false});
    if (info.phone && !phoneRegEx.test(info.phone))
        return res.status(400).json({ error:"Phone number is not valid", success: false});
    if (info.dob && (info.dob = new Date(info.dob)) == "Invalid Date")
        return res.status(400).json({ error:"Date of birth is not valid", success: false});

    updateInfo(email, info)
        .then(() => {
            return res.json({ msg: "Update successfully!", success: true });
        })
        .catch(error => {
            res.status(400).json({ error: error, success: false });
        });
}