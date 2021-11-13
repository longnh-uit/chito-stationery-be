const passport = require("passport");
const nodemailer = require("nodemailer");
const { signUp, isExist, login } = require("../../services/userService");
const { saveToken, checkToken, checkTokenByEmail } = require("../../services/refreshTokenService");
const {
    verifyRefreshToken,
    verifyJWT,
    setCookie,
    generateJWT,
} = require("../../helper/authHelper");
const { json } = require("express");

require("dotenv").config()

module.exports.signup_post = (req, res) => {
    const userData = req.body;
    const { email } = userData;
    const token = generateJWT(userData, process.env.JWT_Secret, "1h");
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        // host: "smtp.office365.com",
        // port: 587,
        // requireTLS: true,
        // secure: false,
        auth: {
            user: process.env.SENDER,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SENDER,
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
            return res.status(400).json({ message: `Error when send email to ${email}`, error: error, success: false });
        } else {
            console.log("Email sent: " + info.response);
            return res.json({ message: `Email has been sent to ${email}`, success: true });
        }
    });   
}

module.exports.activate = async (req, res) => {
    try {
        const { token } = req.params;
        const userData = await verifyJWT(token, process.env.JWT_Secret);
        const { email } = userData;
        const existingUser = await isExist(email);
        if (existingUser) {
            return res.status(400).send({
                success: false,
                error: "Your email has been taken, please use other email to signup"
            });
        }
        await signUp(userData);
        return res.redirect("http://localhost:3000/");
    } catch (err) {
        console.log(err);
        res.status(400).send({ success: false, error: "Your link has been expired, please signup again" });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await login(email, password);
        const { _id } = user;
        const accessToken = generateJWT({ email }, process.env.JWT_Secret, "1d");
        const refreshToken = generateJWT({ _id }, process.env.REFRESH_TOKEN, "1y");
        await saveToken(email, refreshToken, accessToken);
        res.status(200).json({ 
            accessToken: accessToken,
            refreshToken: refreshToken,
            success: true,
            message: "Login successful"
        });
    } catch (err) {
        res.status(400).json({ error: err, success: false, message: "Login failed" })
    }
}

module.exports.authenticate = async (req, res) => {
    const authheader = req.headers['authorization'];

    if (!authheader) 
        return res.status(401).json({ error: "No token provided.", success: false });

    const token = authheader.split(' ')[1];
    try {
        var decoded = await verifyJWT(token, process.env.JWT_Secret);
    } catch (error) {
        return res.status(401).json({ error: "You are not authenticated", success: false });
    }

    const user = await isExist(decoded.email);
    if (user && (token == await checkTokenByEmail(decoded.email))) {
        return res.json({ user: user, success: true })
    } else {
        return res.status(401).json({ error: "You are not authenticated", success: false });
    }
}

module.exports.refresh = async (req, res) => {
    const refToken = req.body.refreshToken;

    if (!refToken) 
        return res.status(401).json({ error: "No token provided.", success: false });

    try {
        const email = await checkToken(refToken);
        const _id = await verifyRefreshToken(refToken, process.env.REFRESH_TOKEN);

        if (email) {
            const accessToken = generateJWT({ email }, process.env.JWT_Secret, "1d");
            const refreshToken = generateJWT({ _id }, process.env.REFRESH_TOKEN, "1y");
            await saveToken(email, refreshToken, accessToken);
            res.json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                success: true,
                message: "Token refreshed"
            });
        } else throw "Token expired";

    } catch (error) {
        res.status(401).json({ error: error, success: false });
    }
}