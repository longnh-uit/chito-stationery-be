const Admin = require("../models/database/admin");

async function signUp(admin) {
    try {
        const newAdmin = new Admin(admin);
        await newAdmin.save();
        console.log("Admin created");
        return newAdmin;
    } catch (error) {
        console.log("Error" + error);
        return false;
    }
}

async function login(username, password) {
    return await Admin.login(username, password);
}

async function isExist(username) {
    return await Admin.findOne({ username })
}

module.exports = { signUp, login, isExist }