const { signUp, login, isExist } = require("../../services/adminService");
const {
    verifyRefreshToken,
    verifyJWT,
    generateJWT,
} = require("../../helper/authHelper");
const keys = require("../../config/keys");

module.exports.signUp = async (req, res) => {
    const admin = req.body;
    const { username } = admin;
    if (await isExist(username)) {
        return res.status(400).json({ error: "Username has been taken", success: false });
    }

    await signUp(admin);
    return res.json({ message: "Successfully!", success: true });
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await login(username, password);
        const accessToken = generateJWT({ username }, keys.JWT_Secret, "1d");
        res.json({
            accessToken: accessToken,
            message: "Login successfully",
            success: true
        });
    } catch (error) {
        res.status(400).json({ error: error, success: false });
    }
}

module.exports.authToken = async (req, res) => {
    const authheader = req.headers['authorization'];

    if (!authheader) 
        return res.status(401).json({ error: "You are not authenticated", success: false });

    const token = authheader.split(' ')[1];
    verifyJWT(token, keys.JWT_Secret)
        .then(async decoded => {
            const admin = await isExist(decoded.username);
            if (admin) 
                res.json({ message: "Authenticated", success: false });
            else return res.status(401).json({ error: "You are not authenticated", success: false });
        })
        .catch(error => {
            console.log(error);
            return res.status(401).json({ error: "You are not authenticated", success: false });
        })
}