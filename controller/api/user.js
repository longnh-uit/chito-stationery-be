const {
    isExist,
    changePassword,
    resetPassword,
    updateInfo,
    verifyUser
} = require("../../services/userService");
const { generateJWT, verifyJWT } = require("../../helper/authHelper");
const keys = require("../../config/keys");
const nodemailer = require("nodemailer");

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
        return res.status(400).json({ error: "Username must be from 3 to 35 character", success: false });
    if (info.phone && !phoneRegEx.test(info.phone))
        return res.status(400).json({ error: "Phone number is not valid", success: false });
    if (info.dob && (info.dob = new Date(info.dob)) == "Invalid Date")
        return res.status(400).json({ error: "Date of birth is not valid", success: false });

    updateInfo(email, info)
        .then(() => {
            return res.json({ msg: "Update successfully!", success: true });
        })
        .catch(error => {
            res.status(400).json({ error: error, success: false });
        });
}

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await isExist(email)

    if (!user)
        return res.status(400).json({ error: "This email address hasn't been signed up yet." })

    const token = generateJWT({ _id: user._id }, keys.JWT_Secret, '20m');
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: keys.SENDER,
            pass: keys.PASSWORD
        }
    });

    const mailOptions = {
        from: keys.SENDER,
        to: `${email}`,
        subject: "Chito Stationery - Reset your password",
        html: `
            <h2>Please click on given link to reset your password</h2>
            <p>${keys.SHOP_ADDR}/reset-password/${token}</p>
            <hr/>
        `,
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(400).json({ error: `Error when sent mail to ${email}`, success: false });
        } else {
            updateInfo(email, { resetLink: token })
                .then(() => {
                    console.log("Email sent: " + info.response);
                    return res.json({ message: `Reset link has been sent to ${email}`, success: true });
                })
                .catch ((error) => {
                    console.log(error.message);
                    return res.json({ error: 'Reset password link error', success: false });
                });
        }
    });
}

module.exports.resetPassword = async (req, res) =>  {
    const { resetLink, newPassword } = req.body;

    if (resetLink) {
        verifyJWT(resetLink, keys.JWT_Secret)
            .then(async decodedData => {
                if (await verifyUser(resetLink, decodedData._id)) {
                    try {
                        await resetPassword(decodedData._id, newPassword);
                        return res.json({ message: "Your password has been changed.", success: true });
                    } catch(error) {
                        if (error instanceof Error) {
                            console.log(error.message);
                            return res.status(400).json({ error: "Something went wrong.", success: false })
                        } else {
                            return res.status(400).json({ error, success: false })
                        }
                    }
                } else {
                    return res.status(401).json({ error: "Token does not match", success: false });
                }
            })
            .catch(error => {
                return res.status(401).json({ error: "Incorrect token or it is expired.", success: false });
            })
    } else {
        return res.status(400).json({ error: "No reset link is given.", success: false});
    }
}