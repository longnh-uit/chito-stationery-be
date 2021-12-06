const nodemailer = require("nodemailer");
const { pugEngine } = require("nodemailer-pug-engine");
const { signUp, isExist, login } = require("../../services/userService");
const { saveToken, checkToken, checkTokenByEmail } = require("../../services/refreshTokenService");
const {
    verifyRefreshToken,
    verifyJWT,
    generateJWT,
} = require("../../helper/authHelper");
const keys = require("../../config/keys");

require("dotenv").config()

module.exports.signup_post = (req, res) => {
    const userData = req.body;
    const { email } = userData;
    const token = generateJWT(userData, keys.JWT_Secret, "1h");
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        // host: "smtp.office365.com",
        // port: 587,
        // requireTLS: true,
        // secure: false,
        auth: {
            user: keys.SENDER,
            pass: keys.PASSWORD,
        },
    });

    transporter.use('compile', pugEngine({
        templateDir: "./template",
        pretty: true
    }))

    const mailOptions = {
        from: keys.SENDER,
        to: `${email}`,
        subject: "Chito Stationery - Activate your account",
        template: "template",
        ctx: {
            name: userData.fullname,
            url: keys.SERVER_URL + "/auth/activate/" + token
        }
        
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
        const userData = await verifyJWT(token, keys.JWT_Secret);
        const { email } = userData;
        const existingUser = await isExist(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Your email has been taken, please use other email to signup"
            });
        }
        const user = await signUp(userData);
        const { _id } = user;
        const accessToken = generateJWT({ email }, keys.JWT_Secret, "1d");
        const refreshToken = generateJWT({ _id }, keys.REFRESH_TOKEN, "1y");
        await saveToken(email, refreshToken, accessToken);
        return res.redirect(`${keys.SHOP_ADDR}/register-success/${accessToken}/${refreshToken}`);
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ success: false, error: "Your link has been expired, please signup again" });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await login(email, password);
        const { _id } = user;
        const accessToken = generateJWT({ email }, keys.JWT_Secret, "1d");
        const refreshToken = generateJWT({ _id }, keys.REFRESH_TOKEN, "1y");
        await saveToken(email, refreshToken, accessToken);
        res.status(200).json({ 
            accessToken: accessToken,
            refreshToken: refreshToken,
            success: true,
            message: "Login successfully"
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
        var decoded = await verifyJWT(token, keys.JWT_Secret);
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
        const _id = await verifyRefreshToken(refToken, keys.REFRESH_TOKEN);

        if (email) {
            const accessToken = generateJWT({ email }, keys.JWT_Secret, "1d");
            const refreshToken = generateJWT({ _id }, keys.REFRESH_TOKEN, "1y");
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