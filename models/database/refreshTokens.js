const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: String,
    email: String
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);