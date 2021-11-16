const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const adminSchema = new Schema({
    username: String,
    password: String
});

adminSchema.pre('save', async function (next) {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } else {
        next();
    }
});

adminSchema.statics.login = async function (username, password) {
    const admin = await this.findOne({ username });

    if (admin) {
        const auth = await bcrypt.compare(password, admin.password);
        if (auth) {
            return admin;
        }
        throw "Incorrect password";
    }

    throw "Incorrect username";
}

module.exports = mongoose.model("Admin", adminSchema);