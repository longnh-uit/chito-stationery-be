const RefreshToken = require("../models/database/refreshTokens");

async function saveToken(email, refreshToken) {
    const check = await RefreshToken.findOne({ email });
    if (!check) {
        const token = new RefreshToken({ refreshToken, email });
        await token.save();
        return token;
    } else {
        return await updateToken(email, refreshToken);
    }
}

async function checkToken(refreshToken) {
    const token = await RefreshToken.findOne({ refreshToken });
    if (token) return token.email;
    return null;
}

async function updateToken(email, refreshToken) {
    try {
        return await RefreshToken.updateOne({ email }, { refreshToken });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { saveToken, checkToken, updateToken }