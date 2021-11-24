const User = require('../models/database/users');

/**Hàm đăng kí user, thành công sẽ trả về user vừa đăng kí, thất bại trả về false */
async function signUp(user) {
    try {
        if (user.orders == null)
            user.orders = 0;
        const newUser = new User(user);
        await newUser.save();
        console.log("User created");
        return newUser;
    } catch(error) {
        console.log("Error: " + error);
        return false
    }
}

async function isExist(email) {
    return await User.findOne({ email })
}

async function login(email, password) {
    return await User.login(email, password)
}

async function changePassword(email, oldPassword, newPassword) {
    
    try {
        await login(email, oldPassword);
        await User.changePassword(email, newPassword);
        return true;
    } catch (error) {
        throw error;
    }
}

async function updateInfo(email, info) {
    try {
        await User.updateOne({ email }, info);
        return true;
    } catch (error) {
        throw error;
    }
}

async function getAllUser() {
    const users = await User.find().sort({ createdAt: -1 });
    return users;
}

module.exports = {
    signUp,
    isExist,
    login,
    changePassword,
    updateInfo,
    getAllUser
}