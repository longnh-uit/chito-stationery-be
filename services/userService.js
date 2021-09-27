const User = require('../models/database/users');

/**Hàm đăng kí user, thành công sẽ trả về user vừa đăng kí, thất bại trả về false */
async function signUp(user) {
    try {
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

module.exports = {
    signUp,
    isExist
}