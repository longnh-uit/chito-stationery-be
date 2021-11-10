const RefreshToken = require("../models/database/refreshTokens");

async function saveToken(email, refreshToken, accessToken) {
    const check = await RefreshToken.findOne({ email });
    if (!check) {
        const token = new RefreshToken({ refreshToken, accessToken, email });
        await token.save();
        return token;
    } else {
        return await updateToken(email, refreshToken, accessToken);
    }
}

async function checkToken(refreshToken) {
    const token = await RefreshToken.findOne({ refreshToken });
    if (token) return token.email;
    return null;
}

async function checkTokenByEmail(email) {
    const token = await RefreshToken.findOne({ email });
    if (token) return token.accessToken;
    return null;
}

async function updateToken(email, refreshToken, accessToken) {
    try {
        return await RefreshToken.updateOne({ email }, { refreshToken, accessToken });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { saveToken, checkToken, updateToken, checkTokenByEmail }