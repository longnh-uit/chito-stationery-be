const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { signUp, isExist, login } = require("../../services/userService")
const {
    verifyRefreshToken,
    setCookie,
    generateJWT,
} = require("../../helper/authHelper");

require("dotenv").config()


module.exports.signup_post = (req, res) => {
    const userData = req.body;
    const { email } = userData;
    const token = jwt.sign(userData, process.env.JWT_Secret, {
        expiresIn: "1h",
    });
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
            <p>${process.env.SERVER_URL}/user/activate/${token}</p>
            <hr/>
        `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(400).json({ msg: `Error when send email to ${email}`, error: error });
        } else {
            console.log("Email sent: " + info.response);
            return res.json(`Email has been sent to ${email}`);
        }
    });   
}

module.exports.activate = async (req, res) => {
    try {
        const { token } = req.params;
        const userData = jwt.verify(token, process.env.JWT_Secret);
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
        const { username, thumbnail, _id, gender, phone, address, dob } = user;
        const userData = {
            _id,
            username,
            email,
            thumbnail: thumbnail || "",
            gender: gender || "",
            phone: phone || "",
            address: address || "",
            dob: dob || ""
        };
        const accessToken = generateJWT(userData, process.env.JWT_Secret, "1d");
        const refreshToken = generateJWT({ _id }, process.env.REFRESH_TOKEN, "1y");
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

module.exports.authenticate = (req, res) => {
    const authheader = req.headers['authorization'];

    if (!authheader) 
        return res.status(401).json({ error: "You are not authenticated", success: false });

    const token = authheader.split(' ')[1];
    try {
        var decoded = jwt.verify(token, process.env.JWT_Secret);
    } catch (error) {
        return res.status(401).json({ error: "You are not authenticated", success: false });
    }

    if (isExist(decoded.email)) {
        return res.json({ user: decoded, success: true })
    } else {
        return res.status(401).json({ error: "You are not authenticated", success: false });
    }
}