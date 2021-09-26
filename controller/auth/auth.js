const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
            <p>${keys.CLIENT_URL}/auth/activate/${token}</p>
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