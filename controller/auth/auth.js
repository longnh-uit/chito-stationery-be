const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { signUp } = require("../../services/userService")

require("dotenv").config()


module.exports.signup_post = (req, res) => {
    const userData = req.body;
    const { email } = userData;
    const token = jwt.sign(userData, process.env.JWT_Secret, {
        expiresIn: "1h",
    });
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: keys.SENDER,
        to: `${email}`,
        subject: "Chito Stationery - Activate your account",
        html: `
            <h3>Please follow link to active your account</h3>
            <p>${process.env.SERVER_URL}/auth/activate/${token}</p>
            <hr/>
        `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(400).json(`Error when send email to ${email}`);
        } else {
            console.log("Email sent: " + info.response);
            return res.json(`Email has been sent to ${email}`);
        }
    });   
}

module.exports.activate = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, keys.JWT_Secret);
        const { email } = decoded;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send(
            "Your email has been taken, please use other email to signup"
            );
        }
        await signUp(userData);
        return res.send(
            "Your account has been activated, please login to use our service, thank you"
        );
    } catch (err) {
        res.status(400).send("Your link has been expired, please signup again");
    }
}