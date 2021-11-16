const { isExist } = require("../models/database/admin");
const { verifyJWT } = require("../helper/authHelper");

module.exports.authToken = async (req, res, next) => {
    const authheader = req.headers['authorization'];

    if (!authheader) 
        return res.status(401).json({ error: "You are not authenticated", success: false });

    const token = authheader.split(' ')[1];
    verifyJWT(token, process.env.JWT_Secret)
        .then(async decoded => {
            const admin = await isExist(decoded.username);
            if (admin) 
                next();
            else return res.status(401).json({ error: "You are not authenticated", success: false });
        })
        .catch(error => {
            console.log(error);
            return res.status(401).json({ error: "You are not authenticated", success: false });
        })
}