const User = require("../models/database/users");

const authSignup = async (req, res, next) => {
    // Initialize regular expressions for username, email and password
    const user = req.body
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegEx = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    const usernameRegEx = /.{3,35}/;

    // Check if not match regex
    if (!usernameRegEx.test(user.username))
        return res.status(400).json("Username must be from 3 to 35 character");
    if (!emailRegEx.test(user.email))
        return res.status(400).json("Must be a valid email");
    if (!passwordRegEx.test(user.password))
        return res
            .status(400)
            .json("Password must contains letters, digits and at least 6 characters");
    
    // If all match, check existing user
    const existingUser = await User.findOne({ username: user.username});
    if (existingUser) {
        return res.status(400).json("That username is already taken");
    }

    const existingEmail = await User.findOne({ email: user.email });
    if (existingEmail) {
        return res.status(400).json("That email is already taken");
    }
    next();
    module.exports = { authSignup };
}